package dq.core.common.quartz;

import com.alibaba.druid.util.StringUtils;
import dq.core.model.ScheduleJob;
import dq.core.utils.DateUtils;
import dq.core.utils.QuartzHandler;
import dq.core.config.SpringContextHolder;
import dq.core.enums.LogNameEnum;
import dq.service.excel.ExecutorUtil;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.TriggerKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
public class QuartzJobExecutor implements Job {

    private static final Logger scheduleLogger = LoggerFactory.getLogger(LogNameEnum.BUSINESS_SCHEDULE.getName());

    private static ExecutorService executorService = Executors.newFixedThreadPool(4);

    @Override
    public void execute(JobExecutionContext jobExecutionContext) {
        ExecutorUtil.printThreadPoolStatusLog(executorService, "Cronjob_Executor", scheduleLogger);
        executorService.submit(() -> {
            TriggerKey triggerKey = jobExecutionContext.getTrigger().getKey();
            ScheduleJob scheduleJob = (ScheduleJob) jobExecutionContext.getMergedJobDataMap().get(QuartzHandler.getJobDataKey(triggerKey));
            if (scheduleJob == null) {
                log.warn("scheduleJob is not found, {}", triggerKey.getName());
                return;
            }

            if (scheduleJob.getStartDate().getTime() <= System.currentTimeMillis()
                    && scheduleJob.getEndDate().getTime() >= System.currentTimeMillis()) {
                String jobType = scheduleJob.getJobType().trim();

                if (!StringUtils.isEmpty(jobType)) {
                    ScheduleService scheduleService = (ScheduleService) SpringContextHolder.getBean(jobType + "ScheduleService");
                    try {
                        scheduleService.execute(scheduleJob.getId());
                    } catch (Exception e) {
                        e.printStackTrace();
                        log.error(e.getMessage());
                        scheduleLogger.error(e.getMessage());
                    }
                } else {
                    log.warn("Unknown job type [{}], job ID: (:{})", jobType, scheduleJob.getId());
                    scheduleLogger.warn("Unknown job type [{}], job ID: (:{})", jobType, scheduleJob.getId());
                }
            } else {
                Object[] args = {
                        scheduleJob.getId(),
                        DateUtils.toyyyyMMddHHmmss(System.currentTimeMillis()),
                        DateUtils.toyyyyMMddHHmmss(scheduleJob.getStartDate()),
                        DateUtils.toyyyyMMddHHmmss(scheduleJob.getEndDate()),
                        scheduleJob.getCronExpression()
                };
                log.warn("ScheduleJob (:{}), current time [{}] is not within the planned execution time, StartTime: [{}], EndTime: [{}], Cron Expression: [{}]", args);
                scheduleLogger.warn("ScheduleJob (:{}), current time [{}] is not within the planned execution time, StartTime: [{}], EndTime: [{}], Cron Expression: [{}]", args);
            }
        });
    }
}
