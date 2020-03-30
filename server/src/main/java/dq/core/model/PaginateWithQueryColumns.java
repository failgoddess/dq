package dq.core.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
public class PaginateWithQueryColumns extends Paginate<Map<String, Object>> {
	private static final long serialVersionUID = 1L;
	List<QueryColumn> columns = new ArrayList<>();
}
