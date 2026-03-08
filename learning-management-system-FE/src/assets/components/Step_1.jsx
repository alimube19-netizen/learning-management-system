import React from 'react'

const Step_1 = () => {
  return (
    <>
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h4 className="text-xl font-semibold mb-4 mt-4 text-gray-800">
        Instructions
      </h4>
      <div className="instruction_stage">
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Form submission is completely <span className="font-semibold">ONLINE</span></li>
          <li>Please complete all steps in order</li>
          <li>Fee deposited for admission process is <span className="font-semibold text-red-600">NON-REFUNDABLE</span></li>
          <li>Your application submission is subject to verification by the admission staff of the relevant campus</li>
          <li>Applications shall be rejected in case of any false information/facts</li>
          <li>Admission charges received after the closing date will not be entertained nor reimbursed</li>
          <li>Result awaiting candidates cannot apply</li>
          <li>
            Candidates with foreign qualifications equivalent to Matric/FSc must have 
            equivalence from <span className="font-semibold">IBCC</span>, and from 
            <span className="font-semibold"> HEC and WES</span> for BS-level degrees
          </li>
          <li>
            Candidates with a valid GAT score can apply only if their test category matches their last degree 
            and the score card is still valid
          </li>
        </ul>
      </div>
    </div>
    </>
  )
}

export default Step_1;