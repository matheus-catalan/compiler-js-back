#include <iostream>
#include <list>

using namespace std;

class Tree
{
  int value;
  list<int> *node;

public:
  Tree(int value);

  void addNode(int v, int w);

  void BFS(int s);
};

Tree::Tree(int value)
{
  this->value = value;
  node = new list<int>[value];
}

void Tree::addNode(int v, int w)
{
  node[v].push_back(w);
}

int main()
{
  Tree tree(4);
  tree.addNode(0, 1);

  tree.addNode(2, 3);
  tree.addNode(1, 2);
  tree.addNode(2, 0);
  tree.addNode(3, 3);
  tree.addNode(0, 2);

  return 0;
}