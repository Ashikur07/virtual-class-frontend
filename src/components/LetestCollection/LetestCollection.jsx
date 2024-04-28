

const LetestCollection = () => {
    return (
        <div>
            <h1 className="text-center text-5xl font-medium mb-10 mt-20">Our Leatest Collection</h1>

            <div className=" border bg-img h-[700px] justify-between px-10">

                <div className="flex justify-between ">
                    <div className="flex gap-5">
                        <img className="-rotate-12 mt-10 border-[5px] border-blue-700 w-48 h-48" src="https://i.ibb.co/PWT8VNy/photo-1579965342575-16428a7c8881-q-80-w-1962-auto-format-fit-crop-ixlib-rb-4-0.jpg" alt="" />

                        <img className="mt-32 border-[5px] border-blue-700 w-52 h-64" src="https://i.ibb.co/PWT8VNy/photo-1579965342575-16428a7c8881-q-80-w-1962-auto-format-fit-crop-ixlib-rb-4-0.jpg" alt="" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 h-[180px] mt-16">
                        <img className=" border-[5px] border-blue-700 w-40 h-40" src="https://i.ibb.co/PWT8VNy/photo-1579965342575-16428a7c8881-q-80-w-1962-auto-format-fit-crop-ixlib-rb-4-0.jpg" alt="" />
                        <img className="border-[5px] border-blue-700 w-40 h-40" src="https://i.ibb.co/PWT8VNy/photo-1579965342575-16428a7c8881-q-80-w-1962-auto-format-fit-crop-ixlib-rb-4-0.jpg" alt="" />
                        <img className=" border-[5px] border-blue-700 w-40 h-40" src="https://i.ibb.co/PWT8VNy/photo-1579965342575-16428a7c8881-q-80-w-1962-auto-format-fit-crop-ixlib-rb-4-0.jpg" alt="" />
                        <img className=" border-[5px] border-blue-700 w-40 h-40" src="https://i.ibb.co/PWT8VNy/photo-1579965342575-16428a7c8881-q-80-w-1962-auto-format-fit-crop-ixlib-rb-4-0.jpg" alt="" />

                    </div>

                    <div className="flex gap-5">
                        <img className="mt-32 border-[5px] border-blue-700 w-52 h-64" src="https://i.ibb.co/PWT8VNy/photo-1579965342575-16428a7c8881-q-80-w-1962-auto-format-fit-crop-ixlib-rb-4-0.jpg" alt="" />

                        <img className="rotate-12 mt-10 border-[5px] border-blue-700 w-48 h-48" src="https://i.ibb.co/PWT8VNy/photo-1579965342575-16428a7c8881-q-80-w-1962-auto-format-fit-crop-ixlib-rb-4-0.jpg" alt="" />
                    </div>

                </div>

                <div className="mt-28 text-center">
                    <button className="btn px-6 btn-primary text-white">Order Now</button>
                </div>


            </div>
        </div>
    );
};

export default LetestCollection;