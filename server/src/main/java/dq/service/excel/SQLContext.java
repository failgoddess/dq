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

package dq.service.excel;

import dq.core.model.Dict;
import dq.core.model.QueryColumn;
import dq.dto.viewDto.ViewExecuteParam;

import java.io.Serializable;
import java.util.List;

public class SQLContext implements Serializable {
	private static final long serialVersionUID = 1L;

	private List<String> executeSql;
    
    private Dict<List<String>,List<String>> executeSqlDict;

    private List<String> querySql;
    
    private Dict<List<String>,List<String>> querySqlDict;

    private List<QueryColumn> queryColumns;

    private ViewExecuteParam viewExecuteParam;

    private List<String> excludeColumns;


    public List<String> getExecuteSql() {
        return executeSql;
    }

    public void setExecuteSql(List<String> executeSql) {
        this.executeSql = executeSql;
    }

    public List<String> getQuerySql() {
        return querySql;
    }

    public void setQuerySql(List<String> querySql) {
        this.querySql = querySql;
    }

    public List<QueryColumn> getQueryColumns() {
        return queryColumns;
    }

    public void setQueryColumns(List<QueryColumn> queryColumns) {
        this.queryColumns = queryColumns;
    }

    public ViewExecuteParam getViewExecuteParam() {
        return viewExecuteParam;
    }

    public void setViewExecuteParam(ViewExecuteParam viewExecuteParam) {
        this.viewExecuteParam = viewExecuteParam;
    }

    public List<String> getExcludeColumns() {
        return excludeColumns;
    }

    public void setExcludeColumns(List<String> excludeColumns) {
        this.excludeColumns = excludeColumns;
    }

	public Dict<List<String>, List<String>> getExecuteSqlDict() {
		return executeSqlDict;
	}

	public void setExecuteSqlDict(Dict<List<String>, List<String>> executeSqlDict) {
		this.executeSqlDict = executeSqlDict;
	}

	public Dict<List<String>, List<String>> getQuerySqlDict() {
		return querySqlDict;
	}

	public void setQuerySqlDict(Dict<List<String>, List<String>> querySqlDict) {
		this.querySqlDict = querySqlDict;
	}
    
}
