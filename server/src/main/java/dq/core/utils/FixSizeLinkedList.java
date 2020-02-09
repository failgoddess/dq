package dq.core.utils;

import java.util.LinkedList;

public class FixSizeLinkedList<E> extends LinkedList<E> {
    private static final long serialVersionUID = -743149260899970541L;

    private int capacity;

    public FixSizeLinkedList(int capacity) {
        super();
        this.capacity = capacity;
    }

    @Override
    public synchronized void addFirst(E e) {
        if (size() + 1 > capacity && size() > 0) {
            super.removeLast();
        }
        super.addFirst(e);
    }

    @Override
    public synchronized E get(int index) {
        return super.get(index);
    }

    @Override
    public synchronized E set(int index, E element) {
        return super.set(index, element);
    }

    @Override
    public synchronized int indexOf(Object o) {
        return super.indexOf(o);
    }
}
