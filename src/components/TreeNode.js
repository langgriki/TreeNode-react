import React from 'react';
import styled from 'styled-components';
import last from 'lodash/last';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { TiTick } from 'react-icons/ti';


const getPaddingLeft = ( level ) => {
    let paddingLeft = level * 20;
    return paddingLeft;
}



const StyledTreeNode = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 8px;
    padding-left: ${props => getPaddingLeft(props.level)}px;
    background: default;
    &:hover {
        background: lightgray;
    }
`;

const Node = styled.div`
    font-size: 12px;
    margin-right: ${props => props.marginRight ? props.marginRight : 5}px;
`;

const getNodeLabel = (node) => last(node.path.split('/'));

const TreeNode = (props) => {
    const { node, getChildNodes, level, onToggle, onNodeSelect } = props;
    
    return(
        <React.Fragment>
            <StyledTreeNode level={level} >
                <Node onClick={() => onToggle(node)} >
                    { node.isOpen ? <FaChevronDown /> : <FaChevronRight /> }
                </Node>
                <Node marginRight={10}>
                </Node>
                <span role='button' onClick={() => onNodeSelect(node)}> 
                    { getNodeLabel(node) }
                    { node.active ? <TiTick /> : null }
                </span>
            </StyledTreeNode>

            { node.isOpen && getChildNodes(node).map((childNode, i) => (
                <TreeNode key={i}
                {...props}
                node={childNode}
                level={level + 1}
                />
            ))}
        </React.Fragment>
    );
}

TreeNode.defaultProps = {
    level: 0,
  };

export default TreeNode;