package com.example.lostandfind.worker;

public class WorkerThread extends Thread{
    private final Channel channel;

    public WorkerThread(String name,Channel channel){

        this.channel = channel;

    }

    @Override
    public void run(){

        while(true){
            Object object = channel.takeRequest();
            if(object.getClass().getSimpleName().equals("Request")){
                ((Request) object).execute();
            }else if(object.getClass().getSimpleName().equals("IllegalComment")){
                ((IllegalComment)object).execute();
            }


        }

    }
}
