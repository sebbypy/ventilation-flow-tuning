from ventilationNetwork import network


nvents = 5

n = network(nvents,initType='uniform')    
print(n.getFlows())



n = network(nvents,initType='random')    
print(n.getFlows())





n = network(nvents,initFlow = 250, initType='userDefined',initValues=[50,60,60,70,60])    
print(n.getFlows())

n = network(nvents,initType='dumb')    
print(n.getFlows())
