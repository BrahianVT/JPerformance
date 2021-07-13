---
title: Garbage-First Garbage Collector
date: "2021-07-03"
description: "This section describes the Garbage-First (G1)"
---

## Garbage-First Garbage Collector

The garbage first (G1) garbage collector is targeted for multiprocessor machines with a large amount of memory. It attempts to meet garbage collection pause-time goals with high probability while achieving
high throughput, some features include:
  - Heap sizes up to tens of GBs or larger, with more than 50% of the Java heap occupied with live data
  - Rates of object allocation and promotion that can vary significantly over time.
  - A significant amount of fragmentation in the heap.
  - Predictable pause-time target goals that aren't longer than a few hundred milliseconds

G1 replaces the Conncurrent Mark-Sweep (CMS) collector, It is also the default collector. G1 Collector achieves high performance and tries to meet pause-time goals in several ways.

## Basic Concepts

Enable it by providing __-XX:+USeG1GC__ on the command line, it is generational, incremental, parallel, mostly concurrent, stop-the-world and evacuating garbage collector which monitors pause-time goals in each of the stop-the-world pauses. Space-reclamations efforts concentrate on the young generation where it is most efficient to do so, with occasional space-reclamation in the old generation, occasional reclamation in the old generation.

To keep stop-the-world pauses short for space-reclamation, G1 performs space-reclamation incrementally in steps and in parallel. G1 achieves predictability by tracking information about previous application behavior and garbage collection pauses to build a model of the associated costs. It uses this information to size the work done in the pauses. G1 reclaims space in the most efficient areas first.

G1 reclaims space by using evacuation: live objects found within selected memory areas to collect are copied into new memory areas, compacting them in the process. After the evacuation, the space previousl occupied by live objects is reused for allocation by the application.

The Garbage-First collector is not a real-time collector. It tries to meet set pause-time targets with high probability over a longer time.

## Heap Layout

![Heap Layout](./heapLayount.png)

G1 partitions the heap into a set of equally sized heap regions, each a contiguous range of virtual memory as shown in the image, a region is the unit of memory allocation and memory reclamation. At any given time, each of these regions can be empty, or assigned to a particular generation, young or old. As requests for memory comes in, the manager hands out free regions. The memory manager assigns them to a generation and  then returns them to the application as free space into which it can allocate itself.

The young generation contains eden regions (red) and survivor regions (red with "S"). These regions provide the same function as the respective contiguous spaces in other collectors, with the difference that in G1 these regions are typically laid out in a noncontiguous pattern in memory. Old generation regions may be humongous (light blue with "H") for objects that span multiple regions.

An application always allocates into a young generation, that is, eden regions, with the exception of humongous objects that are directly allocated as belonging to the old generation. 


## Garbage Collection Cycle

On a high level, the G1 collector alternates between two phases. The young-only phase contains garbage collections that fill up the currently available memory with objects in the old generation gradually. The space-reclamation phase is where G1 reclaims space in the old generation gradually. The space-reclamation phase  in where G1 reclaims space in the old generation incrementally, in addition to handling the young generation. Then the cycle restarts with a young-only phase.

![Cycles](./regions.png)

In the image describes the phases, their pauses and the transition between the phases of the G1 garbage collection in detail:

  ## Young-only
  
  This phase starts with a few Normal young collections that promote objects into the old generation. The transition to the space-reclamation starts when the old generation occupancy reaches a certain threshold.
    -Concurrent Start: Starts the marking process in addition to performing a Normal young collection. Concurrent marking determinates
     all currently reachable (live) objects in the old generation regions to be kept for the following space-reclamation phase.
    -Remark: It finalizes the marking itself, performs global reference processing and class unloading, reclaims completely empty regions
     and cleans up internal data structures.
    -Cleanup: Determines whether a space-reclamation phase will actually follow. If a space-reclamation phase follows, the young-only phase
    completes with a single Prepare Mixed young collection.
  
  ## Space Reclamation Phase 
  Consists of multiple Mixed collections that in adition to young generation regions, also evacuate live objects of sets of old generation regions.
  The space-reclamation phase ends when G1 determines that evacuating more old generation regions wouldn't yield enough free space worth the effort.

After the space-reclamation, the collection cycle restarts with another young-only phase. As backup, if the application runs out of memory while gathering liveness information, G1 performs an in-place-stop-the world full heap compaction (Full GC) like other collectors.

## Garbage Collection Pauses and Collection Set

G1 performs garbage collections and space reclamation in the stop-the-world-pauses. Live objects are typically copied from source regions to one or more destination regions in the heap, and existing references to these moved objects are adjusted. The collection set is the set of source regions
to reclaim space from, the collection set consists of different kinds of regions, in the young phase for example, the collection is from humongous regions with objects that could potentially be reclaimed.  

## Garbage-First Internals

This section describes some important details of the Garbage-First (G1) garbage collector. When resizing the Java heap, using __-XX:InitialHeapSize__ as  the minimum Java heap size,  and __-XX:MaxHeapSize__ as the maximum Java heap size, __-XX:MaxHeapFreeRatio__ for determining the maximum percentage of free memory after resizing.

## Young-Only Phase Generation Sizing

G1 always sizes the young generation at the end of a normal young collection for the next mutator phase. G1 meet the pause time goals using __-XX:MaxGCPauseTimeMillis__ and __-XX:PauseTimeIntervalMillis__ based on long-term observations of actual pause time. It takes into account how long it took young generations of similar size to evecuate.
if not otherwise constrained, then G1 adaptively sizes the young generation size between __-XX:G1NewSizePercent__ and __-XX:G1MaxNewSizePercent__ determine to meet pause-time.

## Space-Reclamation Phase Generation Sizing

During the space-reclamation phase, G1 tries to maximize the amount of space that is reclaimed in the old generation in a single garbage collection pause. The size of the young generation is set to the minimum allowed, typically as determied by __-XX:G1NewSizePercent__. 
In each mixed collection in this phase, G1 selects a set of regions from the collection set candidates to add to the collection set.It consist of three parts, a minimum set of old generation regions and it is determined by the number of regions in the collection set candidates divided by the length of the Space-Reclamation phase determined by __-XX:G1MixedGCCountTarget__. It also adds old generation regions from the collection set candidates if G1 predicts that after collecting the minimum set there will be time left. A set of  optional collection set regions that G1 evacuates incrementally after the other two parts have been evacuated and there is time left in this pause.
The Space-Reclamation phase ends when the remaining amount of space that can be reclaimed in the collection set candidate regions is less than the percentage set by __-XX:G1HeapWastePercent__

## Periodic Garbage Collections
If there is no garbage collection for a long time, the VM may hold on to a large amount of unused memery for a long time that could be used elsewhere. To avoid this , G1 can be forced to do regular garbage collection using the __-XX:PeriodicGCInterval__, if the amount of time passed and if there is no concurrent cycle in progress, G1 triggers additional garbage collections, for example in the Young-Only phase starts a concurrent marking using a Concurrent Start pause if __-XX:-G1PeriodicGCInvokesConcurrent__ was specified.
The __-XX:G1PeriodicGCSystemLoadThreshold__ option may be used to refine whether a garbage collection is triggered.

## Determining Initial Heap Occupancy

The Initiating Heap Occupancy Percent (IHOP) is the threshold at which an Initial Mark collection is triggered and it is defined as a percentage of the old generation size.
An optional IHOP is defined in the G1 by observing how long marking takes abd how much memory is typically allocated in the old generation during marking cycles, the feature is called Adaptive IHOP and the option __-XX:InitiatingHeapOccupancyPercent__ determines the initial value as a percentage of the size of the current old generation as long as there aren't enough observations to make good prediction, turn off this behavior of G1 using the option XX:-G1UseAdaptiveIHOP. IHOP tries to set the Initiating Heap Occupancy so that the first mixed garbage collection of the space-reclamation phase starts when the old generation occupacy is at a current maximum old generation size minus the value of
__-XX:G1HeapReservePercent__ as the extra buffer.

## Marking

G1 marking uses an algorithm called Snapshot-At-The-Beginning (SATB). It takes virtual snapshot of the heap at the time of the Initial Mark pause, when all objects that were live at the start of marking are considered live for the remainder of marking. This means that objects that become dead during marking are still considered live for the purpuse of the space-reclamation.

## Humongous Objects

Humongous objects are objects larger or equal the size of half a region, the current region size is determined ergonomically, unless set using the __-XX:G1HeapRegionSize__ option.
Generally, humongous objects can be reclaimed only at the end of marking during the Cleanup pause, or during Full GC if they became unreachable.There is, however, a special provision for humongous objects for arrays of primitives types for example, bool, all kinds of integers, and floating point values.G1 tries to reclaim humongous objects if they are not referenced by many objects. This behavior is enable by default, you can disable it with the option __-XX:G1EagerReclaimHumongousObjects__.

## Ergonomic Defaults for G1 GC

This topic provides an overview of the most important defaults specific to G1 and their default values.


|    Option and Default Value  		      |          Description                                         
| :----------------------------------   | :----------------------------------------------------------  
| -XX:MaxGCPauseMillis=200      	      | The goal for the maximum pause time.                         
| -------------------------------       | -------------------------------------------
|                                       | 
| -XX:GCPauseTimeInterval=ergo  	      | The goal for the maximum pause time interval. By default
|			      		                        | G1 doesn't set any goal, allowing G1 to perform garbage
|			      		                        | collections back-to-back in extreme cases.
| -------------------------------       | -------------------------------------------
|                                       |
| -XX:ParallelGCThreads=ergo   	        | The maximum number of threads used for parallel work
|			      		                        | during garbage collection pauses. This is derived from
|			      		                        | the number of available threads of the computer that the
|			      		                        | VM runs.
|			      		                        | At the start of every pause, the maximum number of threads
|			      		                        | used is further constrained by the maximum total heap size
|			      		                        | G1 will not use more than one thread 
|                                       | per-XX:HeapSizePerGCThread amount of Java heap capacity.
| -------------------------------       | -------------------------------------------
|                                       | 
| -XX:ConcGCThreads=ergo	      	      | The maximum number of threads used for concurrent work. 
|                                       | By default this value is -XX:ParallelGCThreads.
| -------------------------------       | -------------------------------------------
|                                       |
| -XX:+G1UseAdaptiveIHOP			          | Defaults for controlling the initiating heap occupancy     
|                                       | indicate. 
| XX:InitiatingHeapOccupancyPercent:45  | that adaptive determination of that value is turned on, and 
|					                              | that for the first few collection cycles G1 will use an 
|					                              | occupancy of 45% of the old generation as mark start 
|                                       | threshold.
| -------------------------------       | -------------------------------------------
|                                       |  
| -XX:G1HeapRegionSize=ergo		          | The set of the heap region size based on initial and maximum
|					                              | heap size. So that heap contains roughly 2048 heap regions.
|					                              | The size of a heap region can vary from 1 to 32 MB, and must 
|                                       | be power of 2.
| -------------------------------       | ------------------------------------------- 
|                                       | 
| -XX:G1NewSizePercent=5			          | The size of the young generation in total, which varies 
|                                       | between
| -XX:G1MaxNewSizePercent=60		        | these two values as percentages of the current Java Heap in 
|                                       | use.
| -------------------------------       | -------------------------------------------
|                                       |
| -XX:G1HeapWastePercent=5		          | The allowed unreclaimed space in the collection 
|                                       | set candidates as a percentage. G1 stops the                  
|                                       | space-reclamation phase if the free 
|                                       | space in the collection set candidates is lower than that.
|                                       |
| -------------------------------       | ------------------------------------------- 
| -XX:G1MixedGCCountTaeget=8		        | The expected length of the space-reclamation phase in a number
|					                              | of collections.
|                                       |
| -------------------------------       | -------------------------------------------
| XX:G1MixedGCLiveThresholdPercet=85    | Old generation regions with higher live objects occupancy than
|					                              | this percentage aren't collected in this space-reclamation
|                                       | phase.