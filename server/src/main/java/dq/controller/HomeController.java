package dq.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import springfox.documentation.annotations.ApiIgnore;

@ApiIgnore
@Controller
public class HomeController {

    @RequestMapping("swagger")
    public String swagger() {
        return "redirect:swagger-ui.html";
    }

    @RequestMapping(value = {"", "/"})
    public String index() {
        return "index";
    }

    @RequestMapping(value = {"share", "share/"})
    public String shareIndex() {
        return "share";
    }
}
