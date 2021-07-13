---
title: Factors Affecting Garbage Collection Performance
date: "2021-06-30"
description: "The two most important factors affecting garbage collection performance are total available memory and proportion oh the heap dedicated to young generation."
---

The two most important factors affecting garbage collection performance are total available memory and proportion to the heap dedicated to young generation.

## Total Heap
The most important factor affecting garbage collection performace is total available memory.
Because collections occur when generations fill up, throughput is inversely proporcional to the amount
of memory available.

## Heap options affecting generation size
A number of options affects generation size.

![Memory](./heap.png)

In the image the difference between commited space and virtual space in the heap. At initialization of the virtual machine, the entire space for the heap is reserved.The size of the space reserved can be specified with the __-Xmx__ option, If the value of the __-Xms__ parameter is smaller than the value of the __-Xmx__ parameter,then not all of the space that's reserved is immediately committed to the virtual machine.The uncommitted space is labeled "virtual". The old generation and young generation, can grow to the limit of the virtual space as needed.

Some of the parameters are ratios of one part of the heap to another. For example, the parameter __XX:NewRatio__ denotes the relative size of the old generation to the young generation.

## Default Option Values for Heap Size
The virtual machine grows and shrinks the heap at each collection to try to keep the proportion of free space to live objects at each collection within a specific range.

This target range is set as a percentage by the options __-XX:MinHeapFreeRatio="minimum"__ and __-XX:MaxHeapFreeRatio="maximum"__
and the total size is bounded below by __-Xms"min"__ and above by __-Xmx"max"__.

With these options, if the percent of free space in generation falls below 40%, then the generation expands to maintain 40% free space,up to the maximum allowed size of the generation.

## Conserving Dynamic Footprint by Minimizing Java Heap Size 
If you need to minimize the dynamic memory footprint (RAM consumed during execution) for your application, you can do this by minimizing the Java heap size. Minimize Java heap size by lowering the values of the options __"-XX:MaxHeapFreeRation"__ (default 70%) and __-XX:MinHeapFreeRatio__(default 40%). Lowering __-XX:MaxHeapFreeRatio__ and __-XX:MinHeapFreeRatio__ by 10% has shown
to successfully reduce the heap size without too much performace degradation.

## The Young Generation
The second factor affecting garbage collection performance is the proportion of the heap dedicated to the young generation, the bigger the young generation, the less often minor collections occur.

### Young Generation Size Options
By default, the young generation size is control by the option __-XX:NewRatio__, setting __-XX:NewRatio=3__ means the ratio between the young and old generation is 1:3. The options __-XX:NewSize__ and __-XX:MaxNewSize__ bound young generation size from below and above.

## Survivor Space Sizing
You can use the option __-XX:SurvivorRatio__ to tune the size of the survivor spaces, for example __-XX:SurvivorRatio=6__ sets the ratio between eden and a survivor space to 1:6.



| Option | Default Value                            |
| :----- | :--------------------------------------- |
| -XX:NewRatio      | 2|
| -XX:NewSize      | 1310 MB  |
| -XX:MaxNewSize      | not limited |
| -XX:SurvivorRatio      | 8 |

The maximum size of the young generation is calculated from the maximum size of the total heap and the value of the __-XX:NewRatio__ parameter.
