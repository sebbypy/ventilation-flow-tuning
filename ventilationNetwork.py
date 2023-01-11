class network:
    
    def __init__(self,nVents,initFlow=200):

        self.nVents = nVents

        meanFlow = initFlow/self.nVents


        Qmes = np.ones(nvents)*meanFlow+meanFlow*(np.random.random(nvents)-0.5)
        Qmes = Qmes * initFlow/np.sum(Qmes)
        
        self.vents = [vent() for i in range(nvents)]    
        self.Qtot = np.sum(Qmes)
     
	 
        dpmes = 30
        
        
        dpvents = self.getVentsK()*Qmes**2
        
        self.Knetwork = (dpmes-dpvents)/Qmes**2 # remove vent pressure drop in network K calc


        self.update()

    def update(self):

        totalK = self.Knetwork + self.getVentsK()

        self.actualFlows = self.solveNonLinear(totalK, self.Qtot, np.ones(self.nVents)*self.Qtot/self.nVents)

    def changeTotalFlowRate(self,Qtot):
        self.Qtot = Qtot
        self.update()

    def getFlows(self):
        return list(self.actualFlows)

    def getPressureDrop(self):
        totalK = self.Knetwork + self.getVentsK()
        return np.mean(totalK*self.actualFlows**2)

    def checkDP(self):
        
        totalK = self.Knetwork + self.getVentsK()
        dp = totalK*self.actualFlows**2
        print('Calculated pressure drops',dp)

    def printState(self):
        
        print(self.actualFlows)
        print("Branch pressure drop",self.Knetwork*self.actualFlows**2)
        print("Vents pressure drop",self.getVentsK()*self.actualFlows**2)
        print(self.getVentsK())
        print(self.actualFlows)
		

    def setVentPosition(self,ventNummer,position):
        
        self.vents[ventNummer].setPosition(position)


    def getVentsK(self):
        
        return [v.getK() for v in self.vents]


    def solveNonLinear(self,K,Qtot,Q0,relax=0.3):
        
        Qprev=Q0
        
        Qnew = self.solveLinear(K,Qtot,Qprev)
    
        res = np.sum((Qprev-Qnew)**2)
    
        nit=0    
    
        while res>.01:
            Qprev = Qprev*(1-relax)+Qnew*relax
            Qnew = self.solveLinear(K,Qtot,Qprev)
            
            res = np.sum((Qprev-Qnew)**2)
            
            nit+=1
            if nit>100:
                print('More than 100 iterations, leaving non linear loop')
                return 'Error'
    
        return Qnew
    
    def solveLinear(self,K,Qtot,Qprev):
    
        
        nFlows = len(Qprev)
        #building matrix
        
        A = np.zeros(nFlows**2).reshape(nFlows,nFlows)
        b = np.zeros(nFlows)
        
        
        for i in range(nFlows-1):
            
            A[i,i]=K[i]*Qprev[i]
            A[i,i+1] = -K[i+1]*Qprev[i+1]
        
        """for i in range(nFlows):
            A[nFlows-1,0]=1
            A[nFlows-1,1]=1
            A[nFlows-1,2]=1
            A[nFlows-1,3]=1
            b[nFlows-1] = Qtot
		"""
        for i in range(nFlows):
            A[nFlows-1,i]=1

        b[nFlows-1] = Qtot
		
        x=np.linalg.solve(A,b)
    
        return x



class vent:
    
    def __init__(self):
        reflow = 25
    
        positions = [1,2,3,4,5,6,7,8,15,18]
        positions = [5*p for p in positions]
    
        pressuredrop = np.array([50,37,25,15,11,9,7,4,3,2])
    
    
        kreglage = pressuredrop/reflow**2
        
        
        
        #self.df = pd.DataFrame(index=positions)
        #self.df['k'] = kreglage
        
        self.kValues= kreglage
        self.positions = positions
        self.currentPosition = positions[-1]


    def checkPosition(self,position):
        
        if position<self.positions[0] or position>self.positions[-1]:
            
            print('Wrong position ',position)
            print('Positons must be between ',self.positions[0],'and',self.positions[-1])
            print('Values have been saturated')
            return


    def setPosition(self,position):

        self.checkPosition(position)        
        self.currentPosition = position

    def getK(self):
    
        return np.interp(self.currentPosition,self.positions,self.kValues)
