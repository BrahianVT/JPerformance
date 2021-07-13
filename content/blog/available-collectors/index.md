---
title: Available Collectors
date: "2021-07-02"
description: "The Java HotSpot VM includes three different types of collectors, each with different performance characteristics."
---



## Available Collectors

The Java HotSpot VM includes three diffent types of collectors, each with different 
performance characteristics.

## Serial Collector

The serial collector uses a single thread to perform all the garbage collection work
which makes it relatively efficient because there is no communication overhead between threads.

This is the best option for single processor machines. The serial collector is selected by default on certain hardware and operating system configurations, or can be explicitly enabled with the option __-XX:+UseSerialGC__.

## Parallel Collector

It's also known as throughput collector, it's a generational collector similar to the serial collector. The primary difference between the serial and parallel collectors is that the parallel collector has multiple threads which are used to speed up garbage collection.
The parallel collector is intended for applications with medium-sized to large-sized data sets that are run on multiprocessor hardware. You can enable it by using the __-XX:-UseParallelGC__ option.

## The Mostly Concurrent Collectors

Concurrent Mark Sweep (CMS) collector and Garbage-First (G1) garbage collector are the two mostly concurrent collectors. Mostly concurrent collectors perform some expensive work concurrently to the application.

  - G1 garbage collector: This server-style collector is for multiprocessor machines with a large amount of memory. It meets garbage collection pause-time goals with high probability, it can be explicitly enabled using -XX:+UseG1GC.

  - CMS collector: this collector is for applications that prefer shorter garbage collection pauses and can afford to share processor resources with the garbage collection, this collector is deprecated from JDK 9.

## The Z Garbage Collector

It's a scalable low latency garbage collector. ZGC performs all expensive work concurrently, without stopping the execution of application threads. ZGC is intended for applications which require low latency (less than 10 ms pauses)
and/or use a very large heap. You can enable by using the __-XX:+UseZGC__ option. It's available from JDK 11.  
