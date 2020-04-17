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

package dq.dto.viewDto;

import dq.model.SqlVariable;
import lombok.Data;

import javax.validation.constraints.Min;

import org.apache.commons.lang.StringUtils;
import org.hibernate.validator.constraints.ScriptAssert;

import java.util.List;

@Data
@ScriptAssert(lang="javascript",alias = "_",script="_.leftSql !=null || _.rightSql !=null ",message = "at least one of sql is not empty")
public class ViewExecuteSql {
    @Min(value = 1L, message = "Invalid Source Id")
    private Long sourceId;

    private String leftSql;
    
    private String sql;
    
    private String leftRowKey;
    
    private String rightSql;
    
    private String rightRowKey;

    private List<SqlVariable> variables;
    
    private String condition;

    private int limit = 0;
    private int pageNo = -1;
    private int pageSize = -1;
}
