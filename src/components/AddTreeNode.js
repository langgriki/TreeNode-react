import React from 'react';
import styled from 'styled-components';
import last from 'lodash/last';

const StyledButton = styled.button`
    margin-left: 10px;
    margin-top: 250px;
`;
export default class Add extends React.Component { 

    getNewNodeName = () => {
        if(this.getActiveNodePathName() === null){
            alert('Please, select a node to edit.');    // Вспомогательная функция, чтобы при activeNode[0].length === 0 не вызывался prompt.
            return null;    
        }
        let newNodeName = prompt('Enter new Node name', this.getActiveNodePathName())
        return newNodeName;
    }

    getActiveNodePathName = () =>{
        let activeNode = this.props.findActiveNode();
        if(activeNode.length === 0){
            return null;
        }
        let nodePathName = last(activeNode[0].path.split('/'));
        return nodePathName;
    }

    createNode = () => {
        let name = prompt('Enter new Node element name', 'node');
        let node = {
            name: null,
            path: `${name}`,
            isRoot: false,
            active: false,
            children: [ ],
            level: null,
            key: +new Date()
        }
        return node;
    }
    
    render () {
        const { onAddNode, onEditNode, onDeleteNode, onClearTree} = this.props;
        return( 
            <React.Fragment>
            <StyledButton onClick={() => onAddNode(this.createNode())}>
                ADD
            </StyledButton>
            <StyledButton onClick={() => onEditNode(this.getNewNodeName())}>
                EDIT
            </StyledButton>
            <StyledButton onClick={() => onDeleteNode()}>
                DELETE
            </StyledButton>
            <StyledButton onClick={() => onClearTree()}>
                CLEAR
            </StyledButton>
            </React.Fragment>

        )
    }
}