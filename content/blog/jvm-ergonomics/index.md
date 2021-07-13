---
title: JVM Ergonomics
date: "2021-06-25"
description: Is the process by which the Java Virtual Machine and garbage collection heuristics, improve application performance.

---

Is the process by which the Java Virtual Machine and garbage collection heuristics, improve application performance.


The JVM provides platform-dependent default selections for the garbage collector, heap size and runtime compiler. These selections match the needs of different types of applications while requiring less command-line tuning. In addition, behavior-based tuning dynamically optimizes the sizes of the heap to meet a specified behavior of the application.


## Garbage Collector, Heap, and Runtime Compiler Defaults Selections

These are important garbage collector, heap size, and runtime compiler default selections:
 - Garbage-First (G1) collector
 - The maximum number of GC threads is limited by the heap size and availible CPU resources
 - Initial heap size of 1/64 of physical memory
 - Maximum heap size of 1/4 of physical memory
 - Tiered compiler, using both C1 and C2


The Java HotSpot VM garbage collectors can be configured to preferentially meet one of the next goals:
 * Maximum pause-time goal
 * Application throughput
 * Footprint

### Maximum Pause-Time Goal

The pause time is the duration which the garbage collector stops the application and recovers space that's no longet in use.
The intent of the maximum pause-time goal is to limit the longest of these pauses. An average time for pauses and a variance on that average is maintained by the garbage collector.
The average is taken for the start of the execution, but it's weighted so that more recent pauses count more heavily. If the average plus the variance of the pause-time is greater than the maximum pause-time goal, then the garbage collector 
considers that the goal isn't being met. The maximum pause-time goal is specified with the command option _"XX:MAXGCPauseMillis=nnn"_.
The garbage collector adjunts the Java heap size and other parameters related to garbage collection in an attempt to keep garbage collection
pauses shorter than _"nnn"_.


### Throughput Goal

The throughput goal is measured in terms of the time spent collecting garbage and the time spent outside of the garbage collection.
The goal is specified by the command-line option _"-XX:GCTimeRatio=nnn"_. The ratio of the garbage collection time to application is _1/(1+nnn)_.
For example, _"-XX:GCTimeRatio=19"_ sets a goal of 1/20th or 5% of the total time for garbage collection.
The time spent in garbage collection is the total time for all garbage collection induced pauses.If the throughput goal isn't being met, then one possible action for the garbage collector is to increase the size of the heap so the time spent in the appplication between collection pauses can be longer.

### Footprint
If the throughput and maximum pause-time goals have been met, then garbage collector reduces the size of the heap until one goal can't be met.

### Tuning Strategy
The heap grows or shrinks to a size that supports the chosen throughput goal. Don't choose a maximum value for the heap unless you know that you need a heap greater than the default maximum heap size.
If the heap grows to its maximum size and the throughput goal isn't being met, then the maximum heap size is too small for the throughput goal. Set the maximum heap size to a value that's close to the total physical memory on the platform,
but doesn´t cause swapping of the application.Execute the application again. If the throughput goal isn't met, then the goal for the application time is too high for the available memory on the platform.
If the throughput goal can be met, but the pauses are too long, then select a maximum pause-time goal. Choosing a maximum pause-time goal may mean that your throughput goal won't be met, so choose values that are an acceptable compromise for
the application. 