import React, { Component } from 'react';
import values from 'lodash/values'
import TreeNode from './TreeNode'
import AddTreeNode from './AddTreeNode'
import styled from 'styled-components';


const StyledDiv = styled.div`
    border: 1px groove rgba(0, 89, 181, 0.82);
    margin-right: 25%;
    margin-left: 25%;
    margin-top: 50px;
    padding: 15px;
`;

const data = {
    0: {
        name: 0,
        path: 'Node1',
        isRoot: true,
        active: null,
        children: [1],
        level: 0
    },
    1: {
        name: 1,
        path: 'Node1/Node2',
        isRoot: false,
        active: null,
        children: [2,3],
        level: 1
    },
    2: {
        name: 2,
        path: 'Node1/Node2/Node3',
        isRoot: false,
        active: null,
        children: [],
        level: 2
    },
    3: {
        name: 3,
        path: 'Node1/Node2/Node4',
        isRoot: false,
        active: null,
        children: [],
        level: 2
    },
    4: {
        name: 4,
        path: 'Node5',
        isRoot: true,
        active: null,
        children: [5],
        level: 0
    },
    5: {
        name: 5,
        path: 'Node5/Node6',
        isRoot: false,
        active: null,
        children: [],
        level: 1
    }
}



export default class Tree extends Component {
    state = { 
        nodes: data,
    };

    findActiveNode = () => {
        let activeNode = undefined;
        const { nodes } = this.state;
        activeNode = values(nodes).filter(node => node.active === true);
        return activeNode;
    }

    getRootNodes = () => {
        const { nodes } = this.state;
        return values(nodes).filter(node => node.isRoot === true)
    }

    getChildNodes = (node) => {
        const { nodes } = this.state;
        if (!node.children) return [];
        return node.children.map(path => nodes[path]);
    }

    onToggle = (node) =>{
        const { nodes } = this.state;
        nodes[node.name].isOpen = !node.isOpen;
        this.setState({ nodes })
    }

    onNodeSelect = (node) => {
        const { nodes } = this.state;
        let activeNode = values(nodes).filter(node => node.active === true);
        if(activeNode[0]){
            if(activeNode[0] === nodes[node.name]){
                nodes[node.name].active = false;
                this.setState({ nodes });
                return null;
            }
            activeNode[0].active = false;
        }
        if (nodes[node.name].active){
            nodes[node.name].active = false;
        }else{
            nodes[node.name].active = true;
        }
        this.setState({ nodes })
    }

    getLastId = () => {
        const { nodes } = this.state;
        let array = Object.keys(nodes);
        let newNodeKey = +array[array.length - 1] + 1;
        return newNodeKey;
    }

    isFirstNode = () => {
        const { nodes } = this.state;
        let array = Object.keys(nodes);  // по сути практически бесполезная функция, но для читаемости кода решил добавить
        return array.length;
    }

    onAddNode = (node) => {
        const { nodes } = this.state;

        let activeNode = this.findActiveNode();
        if (activeNode.length === 0) {
            if(!this.isFirstNode()){
                node.name = 0;
                node.isRoot = true;
                nodes[0] = node;
                node.level = 0;
                this.setState({ nodes });
            }else{
            node.name = this.getLastId();
            node.isRoot = true;
            node.level = 0;
            nodes[this.getLastId()] = node;
            this.setState({ nodes });
            }
        }else{
            node.name = this.getLastId();
            activeNode[0].children[activeNode[0].children.length] = node.name;
            node.level = activeNode[0].level + 1;
            node.path = `${activeNode[0].path}/${node.path}`;
            nodes[this.getLastId()] = node;
            this.setState({ nodes });            
        }
    }

    onEditNode = (newNodeName) => {
        let newPath = undefined;
        const { nodes } = this.state;
        let activeNode = this.findActiveNode();
        if(activeNode.length === 0){
            return null;
        }   
        newPath = activeNode[0].path.split('/')
        newPath[newPath.length - 1] = newNodeName;
        activeNode[0].path = newPath.join('/');

        if(activeNode[0].children.length){
            this.editChildrens(activeNode[0], activeNode[0].level)
        }
        this.setState({ nodes });
    }

    editChildrens = (parentNode, editedObjectLevel) =>{
        const { nodes } = this.state;
        let childrenIds = parentNode.children;
        let childPath;
        for (let key in childrenIds){
            childPath = nodes[childrenIds[key]].path.split('/');
            childPath[editedObjectLevel] = parentNode.path.split('/')[editedObjectLevel];
            childPath = childPath.join('/');                                              // Рекурсия в замену всех "roots". 
            nodes[childrenIds[key]].path = childPath;
            if(nodes[childrenIds[key]].children.length){
                this.editChildrens(nodes[childrenIds[key]], editedObjectLevel);
            }
        }
        this.setState({ nodes });
    }

    onDeleteNode = () => {
        const { nodes } = this.state;
        let activeNode = this.findActiveNode();
        let parentNodePath;
        let potentialParentNodePath;
        let parentNode;
        let indexOfChildInChildrenArray;
        if(activeNode.length === 0){
            alert('Please, select a node to delete.')
            return null;
        }
        parentNodePath = undefined;
        potentialParentNodePath = activeNode[0].path.split('/');
        if(potentialParentNodePath.length > 1){                              // Извиняюсь, если тут начнёт резать глаза =)    
            potentialParentNodePath.pop();                                   // Старался делать без кривых костылей, но недостаток опыта даёт о себе знать,
            parentNodePath = potentialParentNodePath.join('/');              // на ходу тяжеловато придумывать здравые решения.
        }else{
            parentNodePath = potentialParentNodePath[0];
        }
        parentNode = values(nodes).filter(node => node.path === parentNodePath);
        if(parentNode.length > 1){
            alert('You have two or more identical node paths, please, edit them.') // Была ошибка при создании одинаковых узлов, оставил, код ведь не идеален,
            return null;                                                            // может в каком-нибудь сценарии повторится.
        }
        indexOfChildInChildrenArray = nodes[parentNode[0].name].children.indexOf(activeNode[0].name)
        nodes[parentNode[0].name].children.splice(indexOfChildInChildrenArray, 1);
        if(activeNode[0].children.length){
            activeNode[0].children.map(name => delete nodes[name]); 
        }
        delete nodes[activeNode[0].name];
        this.setState({ nodes });
    }

    onClearTree = () =>{
        const { nodes } = this.state;
        for (let key in nodes){
            delete nodes[key];
        }
        this.setState({ nodes })
    }


    render(){
        const rootNodes = this.getRootNodes();
        return(
            <StyledDiv >
                { rootNodes.map((node, i) =>(
                    <TreeNode key={i}
                    node={node}
                    getChildNodes={this.getChildNodes}
                    onToggle={this.onToggle}
                    onNodeSelect={this.onNodeSelect}
                    />
                ))}
                <AddTreeNode 
                onAddNode={this.onAddNode}
                onEditNode={this.onEditNode}
                onDeleteNode={this.onDeleteNode}
                onClearTree={this.onClearTree}
                findActiveNode={this.findActiveNode}
                 />
            </StyledDiv>
        )
    }

    
}


Tree.defaultProps = {
    id: 0,
  };
