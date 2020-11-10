import React from 'react';
import styled from 'styled-components';


const StyledButton = styled.button`
    margin-left: 10px;
    margin-top: 250px;
`;
export default class Add extends React.Component { 


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
        const { onAddNode, onEditNode, onDeleteNode, onClearTree } = this.props;
        return( 
            <React.Fragment>
            <StyledButton onClick={() => onAddNode(this.createNode())}>
                ADD
            </StyledButton>
            <StyledButton onClick={() => onEditNode(prompt('Enter new Node name', 'node name'))}>
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