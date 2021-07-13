---
title: The Z Garbage Collector
date: "2021-07-09"
description: "The Z garbage Collector (ZGC) is a scalable low latency garbage collector"
---

The Z Garbage Collector (ZGC) is a scalable low latency garbage collector. ZGC performs all expensive work concurrently, without stopping 
the execution of application threads for more than 10ms, which makes is suitable for applications which require low latency and/or use
a very large heap (multi-terabytes).

The Z Garbage Collector is available as an experimental feature, and is enabled with the command-line options __-XX:UnlockExperimentalVMOptions__
and __-XX:+UseZGC__.

## Setting the Heap Size

The most important tuning option for ZGC is setting the max heap size (__-Xmx__). Since ZGC is a concurret collector a max heap size must be 
selected such that, 1) the heap can be accommodate the live-set of your application, and 2) there is enough headroom in the heap to allow allocations to be serviced while the GC is running. How much headroom is needed very much depends on the allocation rate and the live-set size of
the application. In general, the more memory you give to ZGC the better. But at the same time, wasting memory is undesirable, so it's all about
finding a balance between memory usage and how often the GC needs to run.

## Setting Number of Concurrent GC Threads

The second tuning option one might want to look at is setting the number of concurrent GC threads __-XX:ConcGCThreads__. ZGC has heuristics to automatically select this number. This heuristic usually works well but depending on the characteristics to automatically select this number. This
heuristic usually works well but depending on the characteristics of the application this might need to be adjusted. This option essentially dictates how much CPU-time the GC should be given. Give it too much and the GC will steal too much CPU-time from the application. Give it too little, and the application might allocate garbage faster than the GC can collect it.
