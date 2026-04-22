// 渲染ai回答
import { useEffect, useState } from "react"
import { checkHeading, replaceHeadingStars } from "../helper"
const Answer = ({ ans, totalresult, index, type }) => {
  const [heading, setHeading] = useState(false)
  const [answer, setAnswer] = useState(ans)
  useEffect(() => {
    if (checkHeading(ans)) {
      setHeading(true)
      setAnswer(replaceHeadingStars(ans))
    }

  }, [])

  function checkHeading(str) {
    return /^(\*)(\*)|(.*)\*$/.test(str)
  }
  return (
    <>
      {
        index == 0 && totalresult > 1 ? <span className="pt-2 text-lg block text-white ">{answer}</span> :
          heading ? <span className={"pt-2 text-lg block text-white "}>{answer}</span>
            : <span className={type == 'q' ? 'pl-1' : 'pl-5'}>{answer}</span>}
    </>
  )
}
export default Answer