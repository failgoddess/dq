/*
 * <<
 *  dq
 *  ==
 *  Copyright (C) 2016 - 2019 EDP
 *  ==
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *        http://www.apache.org/licenses/LICENSE-2.0
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *  >>
 *
 */

package dq.model;

import com.alibaba.druid.util.StringUtils;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.annotation.JSONField;
import dq.core.model.RecordInfo;
import lombok.Data;

import java.util.List;

@Data
public class View extends RecordInfo<View> {
    private Long id;

    private String name;

    private String description;

    private Long projectId;

    private Long sourceId;

    private String leftSql;
    
    private String rightSql;

    private String model;

    private String variable;

    private String config;
    
    private String correlation;
    
    private String toolbox;
    
    private String action;

    @Override
    public String toString() {
        return "View{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", projectId=" + projectId +
                ", sourceId=" + sourceId +
                ", leftSql='" + leftSql + '\'' +
                ", rightSql='" + rightSql + '\'' +
                ", model='" + model + '\'' +
                ", variable='" + variable + '\'' +
                ", config='" + config + '\'' +
                ", correlation='" + correlation + '\'' +
                ", toolbox='" + toolbox + '\'' +
                ", action='" + action + '\'' +
                '}';
    }


    @JSONField(serialize = false)
    public List<SqlVariable> getVariables() {
        if (StringUtils.isEmpty(variable) || StringUtils.isEmpty(leftSql)) {
            return null;
        }

        try {
            return JSONObject.parseArray(variable, SqlVariable.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}