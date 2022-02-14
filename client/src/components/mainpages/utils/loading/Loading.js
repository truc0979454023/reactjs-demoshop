import React from 'react'
import './Loading.css'
function Loading() {
    return (
        // <div className="load-page">
        //     <div className="loader">
        //         <div>
        //             <div>
        //                 <div>
        //                     <div>
        //                         <div>
        //                             <div>
        //                                 <div>
        //                                     <div></div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>

        <div className=" loading"
            style={{ color: 'white', top: 0, left: 0, zIndex: 999 }}>
            <svg width="205" height="250" viewBox=" 0 0 40 50">
                <polygon strokeWidth="1" stroke='grey' fill='none'
                    points="20,1 40,40 1,40"></polygon>
                <text fill='grey' x="5" y="47">Loading</text>
            </svg>
        </div>
    )
}

export default Loading