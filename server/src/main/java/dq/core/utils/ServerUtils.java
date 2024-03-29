package dq.core.utils;

import com.alibaba.druid.util.StringUtils;
import dq.core.consts.Consts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;

import static dq.core.consts.Consts.*;

@Component
public class ServerUtils {
    @Value("${server.protocol:http}")
    private String protocol;

    @Value("${server.address}")
    private String address;

    @Value("${server.port}")
    private String port;

    @Value("${server.servlet.context-path:}")
    private String contextPath;

    @Value("${server.access.address:}")
    private String accessAddress;

    @Value("${server.access.port:}")
    private String accessPort;

    @Value("${file.base-path}")
    private String basePath;

    public String getHost() {

        String pro = protocol.trim().toLowerCase();
        String accAddress = StringUtils.isEmpty(accessAddress) ? address : accessAddress;
        String accPort = StringUtils.isEmpty(accessPort) ? port : accessPort;

        if (pro.equals(HTTP_PROTOCOL) && "80".equals(accPort)) {
            accPort = null;
        }

        if (pro.equals(HTTPS_PROTOCOL) && "443".equals(accPort)) {
            accPort = null;
        }

        StringBuilder sb = new StringBuilder();
        sb.append(pro).append(PROTOCOL_SEPARATOR);
        if(accAddress.startsWith(sb.toString())){
        	sb.append(accAddress.substring(sb.length()));
        }else{
        	sb.append(accAddress);
        }
        if (!StringUtils.isEmpty(accPort)) {
            sb.append(":" + accPort);
        }

        if (!StringUtils.isEmpty(contextPath)) {
            contextPath = contextPath.replaceAll(Consts.SLASH, EMPTY);
            if(!sb.toString().endsWith(Consts.SLASH)){
            	sb.append(Consts.SLASH);
            }
            sb.append(contextPath);
        }

        return sb.toString();
    }

    public String getLocalHost() {
        return protocol + PROTOCOL_SEPARATOR + "localhost:" + port;
    }

    public String getBasePath() {
        return basePath.replaceAll("/", File.separator).replaceAll(File.separator + "{2,}", File.separator);
    }
}
