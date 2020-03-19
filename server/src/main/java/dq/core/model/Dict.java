package dq.core.model;

import lombok.Data;

@Data
public class Dict<K,V> {
	private K key;
    private V value;
    
	public Dict(){}
	public Dict(K key,V value){
		this.key = key;
		this.value = value;
	}
    
    public String toString() {
    	return key+":"+value;
    }
}
