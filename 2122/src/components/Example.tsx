import React from "react"

const Example: React.FC<{}> = (props) => {
  const { ...foo } = props

  return <div>Example</div>
}

export default Example
