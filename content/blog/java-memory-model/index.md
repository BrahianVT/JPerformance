---
title: Java Memory Model
date: "2021-07-14"
description: "The Java memory model specifies how the Java virtual machine works with the computer memory"
---

It is important to understand the Java memory model if you want to design efficiently low latency systems.

## The Internal Java Memory Model

The Java memory model used internally in the JVM divides memory between thread stacks and the heap. Each thread running
in the java virtual machine has its own thread stack. The thread stack contains all local variables for each method being
executed . A thread can only access it's own thread stack, all the local variables of primitive types are stored on the
thread stack.

The heap contains all objects created in your Java application, regardless of what thread created the object.

An object may contain methods and these methods may contain local variables. These local variables are also stored on the thread
stack, even if the object is store on the heap, the object's member variables are stored on the heap along with the object itself.
The static class variables are also stored on the heap along with the class definition.

Objects on the heap can be accessed by all threads that jave a reference to the object, if two threads access to an object at the
same time, they will both have their own copy of the local variables.
![Internal Memory](./jmm.png)

## Hadware Memory Architecture

Modern hardware memory architecture is somewhat different from the internal java memory model. It's important to understand the hardware memory architecture too at least in a high level.

A modern PC has often 2 or more CPUs, usually the CPU's have multiple cores too, so it's possible to have more than one thread running simultaneously. Each CPU contains a set of registers which are essentially in-CPU memory. The CPU can perform operations much faster on these registers that it can perform on variables in main memory.

Modern CPUs have a cache memory layer of some size, the CPU cache is memory is somewhere in between the speed of the internal registers and the main memory. All CPUs can access the main memory, the main memory is typically much bigger than the cache memories.

When a CPU needs to access main memory it will read part of main memory into its CPU cache. It also read part of the cache into its internal
registers and then perform operations. When the CPU needs to write the result back to main memory it will flush the value back to main memory.
![Internal Memory](./jmm2.png)


## Mapping between the Java Memory Model and the Hardware Memory Model

The hardware memory architecture does not distinguish between thread stacks and the heap. On the hardware, both the thread stack and the heap  are located in main memory. Parts of the thread stacks and the heap may sometimes be present in the CPU caches and in internal CPU  registers, this illustrated in the image:
![Internal Memory](./jmm3.png)


When the objects and variables are stored in  different memory areas on the hardware, certain problems may occur. The two main problems are:
  - Visibility of thread updates (writes) to shared variables
  - Race conditions when reading, checking and writing shared variables.


## Shared Object Visibility
If two or more threads share objects is mandatory to use either volatile declarations or synchronization. When a shared object is initially stored in main memory, a thread running on the CPU reads the object into its CPU cache. And if the CPU cache doesn't flush the changes back to main memory, the changed version of the shared object is not visible to threads running on other CPUs so each thread may end up with its own copy of the shared object, each copy setting in a different CPU cache.

To solve this problem use the keyword **volatile** and always the variables will be written back to main memory.
![Internal Memory](./jmm4.png)


## Race Conditions
If two or more threads updates variables in  a shared object a race condition may occur. For example it two theads read a varible let's suppose it is 1 and both threads increase by 1 so the final result will be 3, but if there is a race condition the final result will be 2 because each thread will try to write to main memory their own result.
![Internal Memory](./jmm5.png)


To avoid this use a Java **synchrnized block** so it guarantees that only one thread can enter a critical section at a given time.

