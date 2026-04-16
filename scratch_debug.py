import pathlib
from backend.parser import build_graph

# Vault is two levels up from ConstellAI/ (i.e., /594BBtest/)
vault = pathlib.Path(__file__).parents[1]
graph = build_graph(vault)

print("\n--- Insight Connection Debug ---")
for ins in graph.insights:
    print(f"\nInsight: {ins.id} ({ins.letter})")
    papers = [n.id for n in graph.nodes if ins.id in n.insight_ids]
    print(f"  Papers found: {papers}")
    print(f"  Edges generated: {len(ins.edges)}")
    for e in ins.edges:
        print(f"    {e.source} -> {e.target}")
print("\n-------------------------------\n")
