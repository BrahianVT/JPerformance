---
title: Garbage-First Garbage Collector Tuning
date: "2021-07-05"
description: "This section describes how to adapt Garbage-First garbage collector (G1GC) behavior"
---

## General Recommendations for G1

The general recommendations is to use G1 with its defaults settings, eventually giving it a different pause-time goal and setting a maximum Java heap size by using __-Xmx__ if desired.

G1 defaults have been balanced differently than either of the other collectors. G1's goals in the default configuration are neither maximum throughput nor lowest latency, but to provide relatively small, uniform pauses at high throughput. However, G1's mechanisms to incrementally reclaim space in the heap and the pause-time control incur some overhead in both the application threads and in the
space-reclamation efficiency.

If you prefer high throughput, then relax the pause-time goal by using __-XX:MaxGCPauseMillis__ or provide a larger heap. If latency is the main requirement, then modify the pause-time target. Avoid limiting the young generation size to particular values by using options like __-Xmn__ and __-XX:NewRatio__ and others because the young generation size is the main means for G1 to allow it to meet the pause-time. Setting the young generation size to a single value overrides and practically disables pause-time control.

## Moving to G1 from Other Collectors

Generally, when moving to G1 from other collectors, particularly the Concurrent Mask Sweep collector, start by removing all options that affect garbage collection, and only set the pause-time goal and overall heap size by using __-Xmx__ and optionally __-XMs__.

## Improving G1 Performace
G1 is designed to provide good overall performance without the need to specify additional options. However, there are cases when the default heuristics or default configurations for them provide suboptimal results. For diagnosis purposes, G1 provides comprehensive logging. A good start is to use the __-Xlog:gc*=debug__ option and then refine the output from that if necessary.

## Observing Full Garbage Collections
A full heap garbage collection is time consuming. Full GCs caused by too high heap occupancy in the old generation can be detected by finding the words Pause Full in the log. Full GCs are typically preceded by garbage collections that encounter an evacuation failure indicated by __to-space-exhausted__ tags.

G1 gives you several options to handle this situation better:

 - You can determine the number of regions occupied by humongous objects on the Java heap using the the __gc+heap=info__ logging Y in the lines "Humongous regions : X -> Y" give you the amount of regions occupied by humongous objects. If this number is high compared to the number of old regions, the best option is to try to decrease the objects by using __-XX:G1HeapRegionsSize__ .
 - Increase the size of the Java heap. It typically increases the amount of time marking has to complete.
 - Increase the number of concurrent marking threads by setting __-XX:ConcGCThreads__.
 - Force G1 to start marking earlier. G1 automatically determines the Initiating Heap Occupancy Percent threshold based on earlier application behavior. There are two options: Lower the target occupancy for when to start space-reclamation by increasing the buffer used in an adaptive IHOP calculation by modifying __-XX:G1ReservePercent__ ; or, disable the adaptive calculation of the IHOP by setting it manually using -XX:-G1UseAdaptiveIHOP and __-XX:InitiatingHeapOccupancyPercent__.


## Humongous Object Fragmentation

A Full GC could occur before all Java heap memory has been exhausted due to the necessity of finding a contiguous set of regions for them. Potencial options in this case are increasing the heap region size by using the option __XX:G1HeapRegionSize__ to decrease the number of humongous objects, or increasing size of the heap.

## Tuning for Latency

Improve G1 behavior in case of common latency problems that is, if the pause-time is too high.

### Unusual System or Real-Time Usage

For every garbage collection pause, the __gc+cpu=info__ log output contains a line including information from the operating system with a breakdown about where during the pause-time has been spent. An example for such output is __User=0.19s Sys=0.00s Real=0.01s__.

User time is time spent in VM code, system time is the time spent in the operating system, and real time is the amount of absolute time passed during the pause.If the system time is relatively high, then most often the environment is the cause.

Common known issues for high system time are:

- The VM allocating or giving back memory from the operating system memory from the operating system memory may cause unnecessary delays. Avoid the delays by setting minimum and maximum heap sizes to the same value using the options __-Xms__ and ___-Xmx__, and pre-touching all memory using __-XX:AlwaysPreTouch__ to move this work to the VM startup phase.
- In Linux, coalescing of small pages into huge pages by the Transparent Huge Pages (THP) feature tends to stall random processes, not just during a pause. Because the VM allocates and maintains a lot of memory, there is a higher than usual risk that the VM will be the process that stalls for a long time.
- Writing the log output may stall for some time because of some background task intermittently taking up all I/O bandwidth for the hard disk the log is written to. 

## Reference Object Processing Takes Too Long

Information about the time taken for processing of Reference Objects is shown in the Reference Processing phase. Here the G1 updates the referents of Reference Objects according to the requirements of  the particular type of Reference Object. By default, G1 tries to parallelize the sub-phases of the Reference Processing using the following heuristic: for every __-XX:ReferencePerThread__ reference Objects start a single thread, bounded by the value in __-XX:ParallelGCThreads__. This heuristic can be disabled by setting __-XX:ReferencePerThread__ to 0 to use all available threads by default, or parallelization disabled completely by __-XX:-ParallelRefProcEnabled__.  

## Young-Only Collections Within the Young-Only Phase Take Too Long

The time is proportional to the size of the young generation, the number of live objects within the collection set that  needs to be copied, one tuning is decrease __-XX:G1NewSizePercent__.
Also decrease the maximum young generation size  by using __XX:G1MaxNewSizePercent__. This limits the maximum size of the of the young generation and so the number of objects that need to be processed during the pause.

## Mixed Collections Take Too Long

Mixed collections are used to reclaim space in the old generation. The collection set of mixed collections contains young and old generation regions. You can obtain information about how much time evacuation of either young or old generation regions contribute to the pause-time by enabling the __gc+ergo+cset=trace__ log output. Look at the predicted young region time and predicted old region time for young and old generation regions respectively.To reduce the contribution of  the old generation regions to the pause-time, G1 provides the following options:

- Spread the old generation region reclamation across more garbage collection by increasing __-XX:G1MixedGCCountTarget__.
- Avoid collecting regions that take a proportionally large amount of time to collect by not putting them into the candidate collection set by using __-XX:G1MixedGCLiveThresholdPercent__, highly occupied regions take a lot of time to collect.
- Stop old generation space reclamation earlier so that G1 won't collect as many highly occupied regions. In this case, increase __-XX:G1HeapWastePercent__. 

## High Update RS and Scan RS Times

To enable G1 to evacuate single old generation regions, G1 tracks locations of cross-region references, that is references that point from one region to another. The set of cross-region references pointing into a given region is called that region's remembered set. The remembered sets must be updated when moving the contents of a region. Maintenance of the regions' remembered sets is mostly concurrent.

G1 requires complete remembered sets for garbage collection, so the Update RS phase of the garbage collection processes any outstanding remembered set update requests. The Scan RS phase searches for object references in remembered sets, moves region contents, and then updates these object references to the new locations. Depending on the application, these two phases may take a significant amount of time.

Adjusting the size of the heap regions by using the option __-XX:G1HeapRegionSize__ affects the number of cross-region references and as well as the size of the remembered set. Handling the remembered sets for regions may be significant part of garbage collection work.

G1 tries to schedule concurrent processing of the remembered set updates so that the Update RS phase takes approximately __-XX:G1RSetUpdatingPauseTimePercent__ percent of the allowed maximum pause time. By decreasing this value, G1 usually performs more remembered set update work concurrently.

Spurious high Update RS times in combination with the application allocating large objects may be caused by the optimization that tries to reduce concurrent remembered set update work by batching it. If the application that created such a batch happens just before a garbage collection, then the garbage collection must process all this work in the Updated RS times part of the pause. Use __--XX:ReduceInitialCardMarks__ to disable this behavior and potentially avoid these situations.

Scan RS Time is also determined by the amount of compression that G1 performs to keep remembered set storage size low. The more compact the remembered set is stored in memory, the more time it takes to retrieve the stored values during garbage collection. G1 automatically performs this compression, called remembered set, coarsening, while updating the remembered sets depending on the current size of that region's remembered set. The highest compression level, retrieving the actual data can be very slow. The option __XX:G1SummarizeRSetStatsPeriod__ in combination with __gc+remset=trace__ level logging shows if this coarsening occurs. If so, then the X in the line "Did <X> coarsenings" in the Before GC Summary section shows a high value. The __-XX:G1RSetRegionEntries__ option could be increased significantly to decrease the amount of these coarsenings.

## Tuning for Throughput

G1's default policy tries to maintain a balance between throughput and latency; however, there are situations where higher througput is desirable. Apart from decreasing the overall pause-times, the frequency of the pauses could be decreased. The main  idea is to increase the maximum pause time by using __-XX:MaxGCPauseMillis__. The generation sizing heuristics will automatically adapt the size of young generation, which directly determines the frequency of pauses. If that does not result in expected behavior, particulary during the space-reclamation phase, increasing the minimum young generation size using __-XX:G1NewSizePercent__ will force G1 to do that.

In some cases, __-XX:G1MaxNewSizePercent__, the maximum allowed young generation size, may limit throughput by limiting young generation size. In this example combined percentage of Eden regions and survivor regions is close to ___XX:G1MaxNewSizePercent__ percent of the total number of regions. Consider increasing __-XX:G1MaxNewSizePercent__ in this case. Another option to increase throughput is to try to decrease the amount of concurrent work in particular, concurrent remembered set updates often require a lot of CPU resources. Increasing __-XX:G1RSetUpdatingPauseTimePercent__ moves from work concurrent operation into the garbage collection pause. Also the concurrent remembered set updates can be disabled by setting __-XX:-G1UseAdaptiveConcRefinement__ , __-XX:G1ConcRefinamentGreenZone=2G__ , __-XX:G1ConcRefinementThreads = 0__. This mostly disables this mechanism and moves all remembered set update work into the next garbage collection pause.

Enabling the use of large pages by using __-XX:+UseLargePages__ may also improve throughput, you can minimize heap resizing work by disabling it, set the options __-Xms__ and __-Xmx__ to the same value, in adition you can use __-XX:+AlwaysPreTouch__ to move the operating system work to back virtual memory with physical memory to VM startup time.

