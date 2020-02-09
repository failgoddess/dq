package dq.core.enums;

import dq.core.utils.SqlUtils;
import dq.core.common.Constants;
import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static dq.core.consts.Consts.APOSTROPHE;
import static dq.core.consts.Consts.EMPTY;

public enum SqlVariableValueTypeEnum {
    STRING("string"),
    NUMBER("number"),
    BOOLEAN("boolean"),
    DATE("date"),
    SQL("sql");

    private String valueType;

    SqlVariableValueTypeEnum(String valueType) {
        this.valueType = valueType;
    }

    public static List<String> getValues(String valueType, List<Object> values, boolean udf) {
        if (null == values) {
            return null;
        }

        if (values.isEmpty()) {
            return new ArrayList<>();
        }

        SqlVariableValueTypeEnum valueTypeEnum = SqlVariableValueTypeEnum.valueTypeOf(valueType.toLowerCase());

        if (udf && valueTypeEnum != SQL) {
            return values.stream().map(String::valueOf).collect(Collectors.toList());
        }

        if (null != valueTypeEnum) {
            switch (valueTypeEnum) {
                case STRING:
                case DATE:
                    return values.stream().map(String::valueOf)
                            .map(s -> s.equals(Constants.NO_AUTH_PERMISSION) || (s.startsWith(APOSTROPHE) && s.endsWith(APOSTROPHE)) ?
                                    s :
                                    String.join(EMPTY, APOSTROPHE, s, APOSTROPHE))
                            .collect(Collectors.toList());
                case SQL:
                    values.stream().map(String::valueOf).forEach(SqlUtils::checkSensitiveSql);
                    return values.stream().map(String::valueOf).collect(Collectors.toList());
                case NUMBER:
                    return values.stream().map(String::valueOf).collect(Collectors.toList());
                case BOOLEAN:
                    return Arrays.asList(String.valueOf(values.get(values.size() - 1)));
            }
        }
        return values.stream().map(String::valueOf).collect(Collectors.toList());
    }


    public static Object getValue(String valueType, String value, boolean udf) {
        if (!StringUtils.isEmpty(value)) {
            SqlVariableValueTypeEnum valueTypeEnum = SqlVariableValueTypeEnum.valueTypeOf(valueType.toLowerCase());


            if (udf && valueTypeEnum != SQL) {
                return value;
            }

            if (null != valueTypeEnum) {
                switch (valueTypeEnum) {
                    case STRING:
                    case DATE:
                        return String.join(EMPTY, value.startsWith(APOSTROPHE) ? EMPTY : APOSTROPHE, value, value.endsWith(APOSTROPHE) ? EMPTY : APOSTROPHE);
                    case NUMBER:
                    case SQL:
                        return value;
                    case BOOLEAN:
                        return Boolean.parseBoolean(value);
                }
            }
        }
        return value;
    }

    public static SqlVariableValueTypeEnum valueTypeOf(String valueType) {
        for (SqlVariableValueTypeEnum valueTypeEnum : values()) {
            if (valueTypeEnum.valueType.equals(valueType)) {
                return valueTypeEnum;
            }
        }
        return null;
    }

}
