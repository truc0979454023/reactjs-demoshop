
function Slide() {

    //mỗi lần click vào pointer sẽ gọi classname active lên
    const btns = document.querySelectorAll(".nav-btn");
    const sliders = document.querySelectorAll(".video-slide");
    const contents = document.querySelectorAll(".content");

    var sliderNav = function (manual) {
        btns.forEach((btn) => {
            btn.classList.remove("active");
        });

        sliders.forEach((slide) => {
            slide.classList.remove("active");
        });

        contents.forEach((content) => {
            content.classList.remove("active");
        });

        btns[manual].classList.add("active");
        sliders[manual].classList.add("active");
        contents[manual].classList.add("active");

    }

    btns.forEach((btn, i) => {
        btn.addEventListener("click", () => {
            sliderNav(i);
        })
    })
    return (
        <div >
            <section className="home">

                <video className="video-slide active" src="https://player.vimeo.com/external/372187755.sd.mp4?s=442bd287d56898033682732415dacf2e331c39f5&profile_id=139&oauth2_token_id=57447761" autoPlay muted loop></video>
                <video className="video-slide" src="https://player.vimeo.com/external/289984354.sd.mp4?s=9e5a0bb292ec1630ecb2654af2bfbf6fc5f724ad&profile_id=164" autoPlay muted loop></video>
                <video className="video-slide" src="https://player.vimeo.com/external/193033138.sd.mp4?s=ca107f627b0a4c7be9b401914776c8a08194cb97&profile_id=164" autoPlay muted loop></video>
                <video className="video-slide" src="https://player.vimeo.com/external/207729688.sd.mp4?s=eedcba04247d62179e510efc5a63461ef148759b&profile_id=164&oauth2_token_id=57447761" autoPlay muted loop></video>
                <video className="video-slide" src="https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/H5BOVymHiplawzr0/videoblocks-studio-portrait-of-a-young-woman-in-a-white-blouse-black-jacket-and-hat_bzwwfzssp__bff754710b194df45dda71beb87a7c3f__P360.mp4" autoPlay muted loop></video>

                <div className="content active">
                    <h1>Part 1<br /><span>Fashion</span></h1>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years,
                        sometimes by accident, sometimes on purpose (injected humour and the like).
                    </p>
                    <a href="#!">Read more</a>
                </div>

                <div className="content">
                    <h1>Part 2<br /><span>Fashion</span></h1>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years,
                        sometimes by accident, sometimes on purpose (injected humour and the like).
                    </p>
                    <a href="#!">Read more</a>
                </div>

                <div className="content">
                    <h1>Part 3<br /><span>Fashion</span></h1>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years,
                        sometimes by accident, sometimes on purpose (injected humour and the like).
                    </p>
                    <a href="#!">Read more</a>
                </div>

                <div className="content">
                    <h1>Part 4<br /><span>Fashion</span></h1>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years,
                        sometimes by accident, sometimes on purpose (injected humour and the like).
                    </p>
                    <a href="#!">Read more</a>
                </div>

                <div className="content">
                    <h1>Part 5<br /><span>Fashion</span></h1>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years,
                        sometimes by accident, sometimes on purpose (injected humour and the like).
                    </p>
                    <a href="#!">Read more</a>
                </div>

                <div className="media-icons">
                    <a href="#!" ><i className="fab fa-facebook-square"></i></a>
                    <a href="#!" ><i className="fab fa-instagram-square"></i></a>
                    <a href="#!" ><i className="fab fa-twitter"></i></a>
                </div>

                <div className="slider-navigation " >
                    <div className="nav-btn "></div>
                    <div className="nav-btn"></div>
                    <div className="nav-btn"></div>
                    <div className="nav-btn"></div>
                    <div className="nav-btn"></div>
                </div>

            </section>

        </div>
    )

}

export default Slide