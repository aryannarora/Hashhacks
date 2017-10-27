import hashlib as hasher
import json
from flask import Flask, jsonify, request
from uuid import uuid4
"""
Block structure:- 
index,timestamp,previousHash,hash,transactions,balance,chain,nodes,email,lat,long,energy,unit
"""



class Block:
    def __init__(self,index,timestamp,previousHash,email,lat,long,energy,unit):
        self.index = index
        self.timestamp = timestamp
        self.previousHash = previousHash
        self.balance = 100
        self.email = email
        self.lat = lat
        self.long = long
        self.energy = energy
        self.unit = unit
        self.hash = self.calculateHash()


    def calculateHash(self):
        block = {
            'index':self.index,
            'timestamp': self.timestamp,
            'previousHash': self.previousHash,
            'email':self.email,
            'lat':self.lat,
            'long':self.long,
            'energy':self.energy,
            'unit': self.unit
        }
        encrypt = json.dumps(block,sort_keys=True).encode()
        return hasher.sha256(encrypt).hexdigest()


class Blockchain:
    def __init__(self):
        self.transactions = []
        self.chain = []
        self.nodes = set()
        gene = Block(index=0,timestamp='01/01/2017',previousHash='',email='super@blockchain.com',lat=0.0,long=0.0,energy=100,unit=10)
        self.chain.append(gene)

    def create_new_node(self,timestamp,email,lat,long,energy,unit):
        block = Block(index=len(self.chain)+1,timestamp=timestamp,previousHash=self.chain[-1].hash,email=email,lat=lat,long=long,energy=energy,unit=unit)
        self.chain.append(block)
        self.nodes.add(block)
        return block

    def Chain(self):
        return self.chain



# import datetime
# basic = Blockchain()
# basic.create_new_node(timestamp=str(datetime.datetime.now()),email="super2@gmail.com",lat=0.22,long=0.22,energy=100)
# Instantiate the Node
app = Flask(__name__)

# Generate a globally unique address for this node
node_identifier = str(uuid4()).replace('-', '')

# Instantiate the Blockchain
blockchain = Blockchain()


@app.route('/add/', methods=['GET'])
def add_block():
    # timestamp,email,lat,long,energy
    timestamp = request.args.get('timestamp')
    email = request.args.get('email')
    lat = request.args.get('lat')
    long = request.args.get('long')
    energy = request.args.get('energy')
    unit = request.args.get('unit')
    block = blockchain.create_new_node(email=email,timestamp=timestamp,
                               lat=lat,long=long,energy=energy,unit=unit)
    response = {
        'message': 'Node successfully added',
        'index': block.index,
        'previousHash':block.previousHash
    }
    return jsonify(response), 200
@app.route('/chain',methods=['GET'])
def chainBlock():
    chain = [{'previousHash':x.previousHash,'hash':x.hash,'email':x.email,'lat':x.lat,'long':x.long,'energy':x.energy,'unit':x.unit,'balance':x.balance} for x in blockchain.Chain()]

    response = {
        'chain':chain
    }
    return jsonify(response), 200

if __name__ == '__main__':
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)




