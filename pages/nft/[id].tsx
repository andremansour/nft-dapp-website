import React from "react";
import { useDisconnect, useAddress, useMetamask } from "@thirdweb-dev/react";

function NftDropPage() {

	//Auth

	const connectWithMetamask = useMetamask();
	const address = useAddress();
	const disconnect = useDisconnect();

	console.log(address);

	return (
		<div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
			{/* /{left side} */}
			<div className="lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500">
				<div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
					<div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
						<img className="w-44 rounded-xl object-cover lg:h-96 lg:w-72" src="https://img.seadn.io/files/5c51eaff97240c8cc2aa8fd6397aede1.png?fit=max&w=1000" alt="" />
					</div>
					<div className="space-y-2 p-5 text-center ">
						<h1 className="text-4xl font-bold text-white">Andre's sloths</h1>
						<h2 className="text-xl text-gray-300">A collection of slothes.</h2>
					</div>
				</div>
			</div>

			{/* {right side} */}
			<div className="flex flex-1 flex-col p-12 lg:col-span-6">
				{/* {Header} */}
				<header className="flex items-center justify-between">
					<h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
						Welcome to <span className="font-extrabold underline decoration-pink-600/50">ANDRE'S</span> NFT Marketplace
					</h1>
					<button onClick={() => (address ? disconnect() : connectWithMetamask())} className="rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base">
						{address? 'Sign out' : 'Sign in'}
					</button>
				</header>

				<hr className="my-2 border"/>

				{address && (
					<p className="text-center text-sm text-rose-400">You're logged in with your wallet {address.substring(0,5)}...{address.substring(address.length - 5)}</p>
				)}

				{/* {Content} */}
				<div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
					<img className="w-80 object-cover pb-10 lg:h-40" src="https://im2.ezgif.com/tmp/ezgif-2-83dbeb5ff3.jpg" alt=""/>
					<h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">Andre's coding club</h1>
					<p className="pt-2 text-xl text-green-500">13/21 Nfts claimed</p>
				</div>

				{/* {Mint Button} */}
				<button className="h-16 w-full rounded-full bg-red-600 text-white font-bold">
					Mint NFT (0.01 eth)
				</button>
			</div>
		</div>
	);
}

export default NftDropPage;
