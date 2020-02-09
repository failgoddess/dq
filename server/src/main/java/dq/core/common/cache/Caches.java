package dq.core.common.cache;

public enum Caches {
    datasource,
    shareDownloadRecord(2 * 60 * 60L, 1024),
    query(10L, 10000);

    private int maxSize = 1000; //默认最大缓存数量
    private Long ttl = 3600L;     //默认过期时间（单位：秒）

    Caches() {
    }

    Caches(Long ttl, int maxSize) {
        this.ttl = ttl;
        this.maxSize = maxSize;
    }

    public int getMaxSize() {
        return maxSize;
    }

    public Long getTtl() {
        return ttl;
    }
}
