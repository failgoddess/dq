package dq.core.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import dq.core.enums.NumericUnitEnum;
import lombok.Data;

@Data
public class FieldNumeric {
    private int decimalPlaces;

    @JsonIgnore
    private NumericUnitEnum unit;
    private boolean useThousandSeparator;
}
