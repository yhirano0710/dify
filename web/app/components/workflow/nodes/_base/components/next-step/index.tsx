import { memo } from 'react'
import {
  getConnectedEdges,
  getOutgoers,
  useEdges,
  useStoreApi,
} from 'reactflow'
import BlockIcon from '../../../../block-icon'
import type { Node } from '../../../../types'
import { useStore } from '../../../../store'
import Add from './add'
import Item from './item'
import Line from './line'

const NextStep = () => {
  const store = useStoreApi()
  const selectedNode = useStore(state => state.selectedNode)
  const branches = selectedNode?.data.branches
  const edges = useEdges()
  const outgoers = getOutgoers(selectedNode as Node, store.getState().getNodes(), edges)
  const connectedEdges = getConnectedEdges([selectedNode] as Node[], edges).filter(edge => edge.source === selectedNode!.id)

  return (
    <div className='flex py-1'>
      <div className='shrink-0 relative flex items-center justify-center w-9 h-9 bg-white rounded-lg border-[0.5px] border-gray-200 shadow-xs'>
        <BlockIcon type={selectedNode!.data.type} />
      </div>
      <Line linesNumber={branches ? branches.length : 1} />
      <div className='grow'>
        {
          !branches && !!outgoers.length && (
            <Item
              parentNodeId={selectedNode!.id}
              nodeId={outgoers[0].id}
              sourceHandle='source'
              data={outgoers[0].data}
            />
          )
        }
        {
          !branches && !outgoers.length && (
            <Add
              nodeId={selectedNode!.id}
              sourceHandle='source'
            />
          )
        }
        {
          branches?.length && (
            branches.map((branch) => {
              const connected = connectedEdges.find(edge => edge.sourceHandle === branch.id)
              const target = outgoers.find(outgoer => outgoer.id === connected?.target)

              return (
                <div
                  key={branch.id}
                  className='mb-3 last-of-type:mb-0'
                >
                  {
                    connected && (
                      <Item
                        data={target!.data!}
                        parentNodeId={selectedNode!.id}
                        nodeId={target!.id}
                        sourceHandle={branch.id}
                        branchName={branch.name}
                      />
                    )
                  }
                  {
                    !connected && (
                      <Add
                        key={branch.id}
                        nodeId={selectedNode!.id}
                        sourceHandle={branch.id}
                        branchName={branch.name}
                      />
                    )
                  }
                </div>
              )
            })
          )
        }
      </div>
    </div>
  )
}

export default memo(NextStep)
