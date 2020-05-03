__all__ = ['grasper_datasets', 'grasper_apps', 'grasper_sysconfig']
cd_param = {
        'name':'k-threshold',
        'type':None,
        'help':'Threshold that only store the result communities with size >= K_THRESHOLD. Should be an integer within [2, 10000].',
        'default': 6,
        }

min_weight = {
        'name': 'min-weight',
        'type': None,
        'help': 'Threshold that only add the new candidates into subgraph with weight >= MIN_WEIGHT. Should be a number within [0.0, 1.0].',
        'default': 0.57,
        }

min_core_size = {
        'name': 'min-core-size',
        'type': None,
        'help': 'Threshold that only compute the seedtask with its subgraph size >= MIN_CORE_SIZE. Should be an integer within [1, 100].',
        'default': 3
        }

min_result_size = {
        'name': 'min-result-size',
        'type': None,
        'help':'Threshold that only store the result cluster with size >= MIN_RESULT_SIZE. Should be an integer within [1, 1000].',
        'default': 20
        }

diff_ratio = {
        'name': 'diff-ratio',
        'type': None,
        'help': 'Threshold for judging two weight is similarity or not. Should be a number within [0.0, 1.0].',
        'default': 0.05
        }

iter_round_max = {
        'name': 'iter-round-max',
        'type': None,
        'help': 'Threshold that only compute number of iterations < ITER_ROUND_MAX with each task. Should be an integer within [1, 3000].',
        'default': 10
        }

cand_max_time = {
        'name': 'cand-max-time',
        'type': None,
        'help': 'Threshold that only compute the top CAND_MAX_TIME*subgraph_size candidates in each round during computation. Should be an integer within [1, 3000].',
        'default': 3
        }

# visualization sampling

tc_sampling_min = {
        'name': 'tc-sampling-min',
        'type': None,
        'help': 'Minimum triangle count. Should be an integer within [4, 200].',
        'default': 4
        }

tc_sampling_max = {
        'name': 'tc-sampling-max',
        'type': None,
        'help': 'Maximum triangle count. Should be an integer within [4, 200].',
        'default': 100
        }

gm_sampling_min = {
        'name': 'gm-sampling-min',
        'type': None,
        'help': 'Minimum matched pattern count. Should be an integer within [4, 200].',
        'default': 4
        }

gm_sampling_max = {
        'name': 'gm-sampling-max',
        'type': None,
        'help': 'Maximum matched pattern count. Should be an integer within [4, 200].',
        'default': 100
        }

cd_sampling_min = {
        'name': 'cd-sampling-min',
        'type': None,
        'help': 'Minimum community size. Should be an integer within [4, 100].',
        'default': 4
        }

cd_sampling_max = {
        'name': 'cd-sampling-max',
        'type': None,
        'help': 'Maximum community size. Should be an integer within [4, 100].',
        'default': 50
        }

gc_sampling_min = {
        'name': 'gc-sampling-min',
        'type': None,
        'help': 'Minimum cluster size. Should be an integer within [4, 100].',
        'default': 8
        }

gc_sampling_max = {
        'name': 'gc-sampling-max',
        'type': None,
        'help': 'Maximum cluster size. Should be an integer within [4, 100].',
        'default': 50
        }

cache_size = {
        'name': 'cache-size',
        'help': 'The size of cachetable in each worker. Should be an integer within [10000, INT_MAX].',
        'default': 1000000000
        }
num_comp_th = {
        'name': 'num-comp-thread',
        'help': 'Number of threads in threadpool for task computation. Should be an integer within [1, 22].',
        'default': 22
        }
pipe_pop_num = {
        'name': 'pipe-pop-num',
        'help': 'Number of tasks popped out each batch in the pipeline. Should be an integer within [100, 5000].',
        'default': 500
        }
pop_num = {
        'name': 'pop-num',
        'help': 'Number of tasks for pque pops tasks to remote worker during one stealing procedure. Should be an integer within [50, 5000].',
        'default': 100
        }
subg_size_t = {
        'name': 'subg-size-t',
        'help': 'Threshold that task can be moved to other workers only if its current subgraph size <= SUBG_SIZE_T. Should be an integer within [10, 100].',
        'default': 30
        }

grasper_datasets = ['youtube', 'skitter', 'orkut', 'friendster', 'dblp', 'tencent']

grasper_apps = [
            {'tc': {'name':'Triangle Counting', 'param': None, 'rules': [tc_sampling_min, tc_sampling_max]}} , 
            {'mc': {'name':'Max Clique', 'param': None, 'rules': None}} , 
            {'gm': {'name':'Graph Matching', 'param': None, 'rules': [gm_sampling_min, gm_sampling_max]}} , 
            {'cd': {'name': 'Community Detection', 'param': [cd_param], 'rules': [cd_sampling_min, cd_sampling_max]}}, 
            {'fco': {'name': 'Graph Clustering', 'param': [min_weight, min_core_size, min_result_size, diff_ratio, iter_round_max, cand_max_time], 'rules': [gc_sampling_min, gc_sampling_max]}}
            ]

grasper_supervisors = [
    {'name': 'James Cheng', 'img':'jcheng.jpg', 'info':'', 'other':'Supervisor'},
    ]
grasper_persons = [
    {'name': 'Hongzhi Cheng', 'img': 'chz.jpg', 'info': ' is a PhD student in the Department of Computer Science and Engineering, The Chinese University of Hong Kong. His research interests cover the broad area of distributed systems and databases, with special emphasis on large-scale graph processing systems, distributed data analytics systems.'},
    {'name': 'Changji Li', 'img': 'lcj.jpg', 'info': ' is currently a Master student in Department of Computer Science and Engineering, Chinese University of Hong Kong. He will pursue MPhil degree in CSE, CUHK as well whose research interests are about distributed computing system and large-scale graph processing.'},
    {'name': 'Bowen Wu', 'img': 'noimage.jpg', 'info': ' I am Bowen WU, a final year CS student in CUHK.'},
    {'name': 'DengShi Yuan', 'img': 'dsy.jpg', 'info': ' is currently a Undergraduate student in Department of Computer Science and Engineering, Chinese University of Hong Kong. He will pursue P.hD degree in CSE, CUHK following Prof.Yufei Tao as well.'},
    {'name': 'Chenghuan Huang', 'img': 'hch.jpg', 'info': ' is a Research Assistant in the Department of Computer Science and Engineering, Chinese University of Hong Kong. He is familiar with parallel programming.'},
    {'name': 'Juncheng Fang', 'img': 'jc.jpg', 'info': ' is an undergraduate in the Department of Computer Science and Engineering, The Chinese University of Hong Kong. He is now interested in distributed system.'}
    ]

grasper_compare = [
    {'slide': 1, 'description': 'We first report the results of comparing with the distributed systems, Titan and JanusGraph, running on 10 machines and using the same number of threads as Grasper. The latency of processing each type of query is shown in Table 5. Grasper achieves excellent performance compared with Titan and JanusGraph for all types of queries on both benchmarks, especially for processing the heavy-workload queries (e.g., IC1-IC4, Q3, Q4, Q5). These queries have heavy workloads because they have complex query logics (e.g., IC1-IC4) or the size of the intermediate results between query steps is large (e.g., Q3-Q5), which are challenging for existing systems to achieve low query latency.'},
    {'slide': 2, 'description': 'Next we report the results of comparing Grasper with Neo4j, OrientDB and TigerGraph, where all the four systems were deployed on a single machine and using the same number of threads. We only ran the experiment on the LDBC benchmark since for the AMiner dataset, Neo4j ran into errors during index construction and OrientDB ran out of memory during data loading. Table 6 lists the query latency of the systems. Grasper achieves very competitive performance especially compared1 with Neo4j and OrientDB. Compared with TigerGraph, Grasper has advantage in processing IS1-IS4. For IC1-IC4, TigerGraph’s run time is very competitive, which is significantly shorter than the query time of all the other systems. This is because TigerGraph processes a query first by an “install” process, which (according to their documentation) pre-translates and optimizes the query, and then by a “run” process to execute the installed query. The install process takes a long time, but signifi- cantly improves the run time for all types of queries. As TigerGraph is not fully open source, we cannot further analyze what exactly TigerGraph does in installing a query. Note that TigerGraph can also be run in an “interpret” mode, which directly processes a query without installing the query, but its latency is significantly longer than Grasper and Neo4J for processing any of the queries. Overall, the results also show that Neo4j performs better on complex queries (i.e., IC1-IC4), OrientDB is better on simple queries (i.e, IS1-IS4), TigerGraph has competitive run time but at the cost of a long install process, and Grasper achieves good balanced performance for all queries without an expensive installation or optimization process.'},
    {'slide': 3, 'description': 'To evaluate query throughput performance, we used the IS queries in the LDBC benchmark and {Q1, Q2, Q6} in our benchmark as the query templates to generate as many queries as the systems could handle. Figure 13 and Figure 14 report the throughput comparison with the other two distributed systems. As Figure 13(a) shows, Grasper achieves a throughput of 13K+ queries/sec on 10 machines for the LDBC workload. As a comparison, JanusGraph’s throughput is 2.9K+ queries/sec and Titan’s is 1.7K queries/sec. Compared with JanusGraph and Titan, Grasper also achieves good scalability as its throughput increases more than 4 times when the number of machines increases from 2 to 10. Figure 14(a) shows that on our benchmark using the AMiner dataset, Grasper’s throughput is about 20-30 times higher than that of JanusGraph and Titan. The gap between Grasper’s throughput and that of JanusGraph and Titan is much bigger for this workload than for the LDBC workload because the queries generated from the {Q1, Q2, Q6} templates have lighter workload than the LDBC queries, as also reflected by Grasper’s throughput on these two types of workloads. Grasper achieves much higher throughput for processing queries of lighter workload because the design of its Expert Model enables high concurrent processing of multiple queries: first, adaptive parallelism control sets a minimum parallelism needed for processing a light workload so that threads can be more fully used; second, tailored optimizations effectively share common data structures for the processing of many query steps that belong to the same category, thus allowing resources to be better utilized to process more queries. Figure 13(b) and Figure 14(b) further plot the CDF curves of each class of queries processed by Grasper. The results show that the 50th percentile latency is only 2-5 times shorter than the 99th percentile latency. These steep curves and the absence of long tail in the CDFs also indicate that there is no starvation phenomenon when we process a large number of queries concurrently. The results verify the effectiveness of Expert Model in handling load balancing (or stragglers) and high concurrent processing.'},
    {'slide': 4, 'description': 'Table 11 shows that Grasper achieves shorter latency for all queries, and the performance gap significantly widens for queries with heavier workloads (e.g., Q3, A2 and A3). This shows that, in addition to the use of RDMA, specialized system designs and optimizations are needed to support the efficient processing of the more complex Gremlin queries over PG data. We further used {Q1, Q3, A1} as templates to generate a mixed query workload for throughput evaluation. Figure 9(a) shows that Grasper achieves an order of magnitude higher throughput. The performance difference on throughput is considerably greater than that on latency, which indicates that Grasper achieves better resource utiliza- tion than Wukong for processing these queries. This can be partially explained by the CDF curves in Figure 9(b), which shows that more than 20% of the queries with light workloads (i.e., Q1 and A1) were starved in Wukong. In contrast, Grasper is free of starvation as the Expert Model decomposes the execution of each query into steps and processes each step with adaptive parallelism, and idle worker threads steal work from others to improve CPU utilization.'},
    {'slide': 5, 'description': 'The Expert Model also allows query steps of similar types to be processed by the same expert to share cache and indexes, which is more memory-efficient as shown in Figure 10. In contrast, Wukong requires a replica of the indexes (i.e., predicate index and type index) in every server.'},
    {'slide': 6, 'description': 'In this set of experiments, we want to evaluate the effects of Grasper’s system designs and optimizations on its performance. Note that it is difficult to measure the performance benefits brought by each component/technique in Grasper as often we only see a positive effect when different components/techniques are integrated together. Thus, we only tested those parts that are easier to be evaluated on their individual effects. Table 7 first reports the effect of adaptive parallelism control (APC) on query latency by comparing the two cases when Grasper enables/disables APC, where disabling APC means to process message (if any) with fixed parallelism of 1 in each server. The results show that APC achieves speed-ups in processing all the queries, especially for the complex queries IC1-IC4 that have the heaviest workloads, because their bottleneck steps are given higher paral- lelism for their execution. Then we examined the effect of locality-aware thread binding and load balancing (TS&LB) on query throughput, using the same workloads as in Section 6.2. Figure 15 shows that the overall throughput of Grasper is considerably improved after the TS&LB mechanism is enabled. This indicates that the memory locality on CPU, the side-effects of thread switching and stragglers due to overloaded threads affect the throughput performance. Grasper’s Expert Model provides an integrated design to address these issues.'},
    {'slide': 7, 'description': 'We increased the number of machines from 2 to 10 to measure the change on query latency. Figures 16(a) and 16(c) report the results for the IS queries on LDBC and the light queries on our benchmark using the AMiner dataset. Processing these queries has relatively stable performance and using more machines does not reduce the latency as it is sufficient to process these light-workload queries with a small amount of computing resources. Comparatively, Figure 16(b) and 16(d) show that the latency of processing the heavy-workload queries can decrease quite significantly (note that the figures are in log scale) when more machines are used. This is because the complex logic and heavy computation can benefit from more CPU resource and higher parallelism, where more machines servers also mean more experts to process the query steps in parallel. Note that the traversal-based and filter-based query steps in these queries, which belong to the sequential flow type, can achieve more speed-ups with higher parallelism. Although the cost of communication will increase when we use more machines, the network communication cost is no longer the major overhead due to the use of RDMA.'},
    {'slide': 8, 'description': 'We further evaluate the system performance on a much larger graph. We used the Twitter 5 graph, which originally has no property attached, and we randomly generated some properties for both vertices and edges. Some statistics of Twitter is also given in Table 3. For this graph, only Grasper can be run and both Titan and JanusGraph could not finish data loading even in 3 days using 10 machines. Figure 17 reports the results of Grasper for query latency and throughput. Note that Grasper crashed on 2 machines due to OOM issue. On this much larger dataset, Grasper also achieves high performance with short query latency (in milliseconds) and linear throughput. The results show the competitiveness of Grasper on processing large graphs compared with existing graph databases.'},
    {'slide': 9, 'description': 'Table 9 shows that Grasper achieves shorter latency on all queries, and the performance gap significantly widens for those queries with heavier workloads (e.g., Q4, Q5, Q8). This validates the importance of specialized system designs and optimizations for the efficient processing of complex queries, regardless of the underlying storage model. We further used {Q1, Q3} as templates to generate a mixed query workload for throughput evaluation. Figure 18(a) shows that Grasper also achieves high throughput compared with Wukong and Virtuoso. The higher throughput may be explained by Grasper’s better resource utilization as the CDF curves in Figure 18(b) show that for Wukong, more than 25% of the queries with light workloads (i.e., Q1) have much longer latency than the rest, and Virtuoso’s case is also not much better. In contrast, the difference in query latency is much smaller for Grasper, as Expert Model processes each step with adaptive parallelism and tailored optimization, while also enabling idle worker threads to steal work from others for better CPU utilization.'},
    ]

grasper_sysconfig = [
    cache_size, num_comp_th, pipe_pop_num, pop_num, subg_size_t 
]

def get_grasper_codes():
    keys = ['tc','mc','gm','cd','fco']
    filen = ['trianglecount.cpp','maxclique.cpp','graphmatch.cpp','community.cpp','focusCO.cpp']
    res = []
    for k, name in zip(keys, filen):
        with open('./apps/' + name) as f:
            a = f.read()
            res.append((k, a))
    return res

grasper_codes = get_grasper_codes()
