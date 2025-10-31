import { useState } from "react";

import AddPost from "./add-post";

function CreatePost() {
    const [popupDisplay, setPopupDisplay] = useState(false);

    const popupHandler = () => {
        setPopupDisplay(!popupDisplay);
    };

    return (
        <>
            <div className="mt-8">
                <button
                    className="btn bg-[#FFAD2F] text-white"
                    onClick={popupHandler}
                >
                    New Post
                </button>

                {popupDisplay && <AddPost popupHandler={popupHandler} />}
            </div>
        </>
    );
}

export default CreatePost;
