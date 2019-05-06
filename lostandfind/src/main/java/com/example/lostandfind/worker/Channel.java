package com.example.lostandfind.worker;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

public class Channel {
    private static final int MAX_REQUEST = 100;

    private List requestQueue;

    private final WorkerThread[] threadPool;

    public Channel(int threads){
        requestQueue = new ArrayList();

        threadPool = new WorkerThread[threads];

        for(int i = 0;i<threadPool.length;i++){

            threadPool[i] = new WorkerThread("Worker-"+i, this);

        }

    }

    public void startWorkers(){

        for(int i =0;i<threadPool.length;i++){

            threadPool[i].start();

        }

    }

    public synchronized void putRequest(Object object){

        requestQueue.add(object);

        notifyAll();

    }

    public synchronized Object takeRequest(){

        while(requestQueue.size() <=0){

            try {

                wait();

            } catch (InterruptedException e) {

// TODO Auto-generated catch block

                e.printStackTrace();

            }

        }

        Object object = requestQueue.get(0);
        requestQueue.remove(0);
        notifyAll();

        return object;

    }
}
