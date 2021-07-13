---
title: Garbage Collector implementation
date: "2021-06-26"
description: The garbage collection is the principal bottleneck, it's useful to understand some aspects of the implementation
---


The garbage collection is the principal bottleneck, it's useful to understand some aspects of the implementation. Garbage collectors make assumptions about the way applications use objects, and these are reflected in tunable parameters that can be adjusted for improved performance without sacrificing the power of the abstraction.

## Generational Garbage Collection
An object is considered garbage and its memory can be reused by the VM when it can no longer be reached from any reference of any other live object in the running program.

The JVM incorporates a number of different garbage collection algorithms that all use a technique called generational collection. The most important property is the weak generational hypothesis, which states that most objects survive for only a short period of time.

![Memory](./blue.png)
The blue area in  the image is the typical distribution for the lifetimes of objects.The x-axis is the total bytes in objects with the corresponding lifetime.The sharp peak at the the left represents objects that be reclaimed shortly after being allocated so it focus in the assumption that a majority of objects "die young".

### Generations

To optimaze for this scenario, memory is managed in  generations(memory pools holding objects of different ages).
Garbage collection occurs in each generation when the generation fills up.

![Memory](./memorySections.png)
At the startup, the VM reserves the entire Java heap in the address space, but doesn't allocate any physical memory for it unless needed, the space is logically divided into young and old generations.

The Young generation consists of eden and two survivor spaces. Most objects are initially allocated in the eden. One survior space is empty at any time, and serves as the destination of live objects in eden and the other survivor space during garbage collection, after a garbage collection, eden and the survivor space are empty.In the next garbage collection, the purpose of the two survivor spaces are exchanged. The one space recently filled is a source of live objects that copied into the other survivor space.Objects are copied between survivor spaces in this way until they've been copied a certain number of times or there isn't enough space left there. These objects are copied into the old region. This process is also called aging.

### Performance Considerations

The primary measures of the garbage collection are throughput and latency.
.Throughput is the percentage of total time not spent in garbage collection considered over long periods of time.
.Latency is the responsiveness of an application. Consider the right metric for a web server to be throughput because pauses during garbage collection may be tolerable, obscured by network latencies. However in an interactive graphics program, even short pauses affect the user experience.

### Throughput and Footprint Measurement
Throughput and footprint are best measured using metrics particular to the application.
For example, the throughput of a web server may be tested using a client load generator.
Also in the VM logs with the command __"-verbose:gc"__ prints information about the heap andgarbage collection at each collection for example:

    [15,651s][info ][gc] GC(36) Pause Young (G1 Evacuation Pause) 239M->57M(307M) (15,646s, 15,651s) 5,048ms.
    [16,162s][info ][gc] GC(37) Pause Young (G1 Evacuation Pause) 238M->57M(307M) (16,146s, 16,162s) 16,565ms.
    [16,367s][info ][gc] GC(38) Pause Full (System.gc()) 69M->31M(104M) (16,202s, 16,367s) 164,581ms


The output shows two young generations followeb by a full collection bacause of the __"System.gc()"__ call.

The first line shows 239M->57M(307M), which means that 239M were usef before the GC and the GC cleared up most of the memory, but 57MB survived. The heap size is 307M, note that the full GC shrinks the heap from 307 MB to 104 MB, the start and end times for the GC are logged as well as the duration (end-start).