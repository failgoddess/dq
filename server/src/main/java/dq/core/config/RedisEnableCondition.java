package dq.core.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

@Slf4j
public class RedisEnableCondition implements Condition {

    private static Boolean isRedisEnable = null;

    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        if (isRedisEnable == null) {
            isRedisEnable = context.getEnvironment().getProperty("spring.redis.isEnable", Boolean.class);
        }
        return isRedisEnable != null && isRedisEnable;
    }
}
