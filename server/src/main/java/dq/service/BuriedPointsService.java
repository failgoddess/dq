package dq.service;

import java.util.List;

public interface BuriedPointsService {

    <T> void insert(List<T> durationInfos, Class clz);

}
