package dq;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAutoConfiguration(exclude = {org.springframework.boot.autoconfigure.gson.GsonAutoConfiguration.class})
@EnableScheduling
public class DQServerApplication {

    public static void main(String[] args) {
        System.setProperty("mail.mime.splitlongparameters", "false");
        SpringApplication.run(DQServerApplication.class, args);
    }

}

