import React, { useEffect, useState } from "react";
import { useDisconnect, useAddress, useMetamask, useContract } from "@thirdweb-dev/react";
import { GetServerSideProps } from "next";
import { sanityClient, urlFor } from "../../sanity";
import { Collection } from "../../typings";
import Link from "next/link";
import { BigNumber } from "ethers";
import toast, { Toaster } from "react-hot-toast";


interface Props{
	collection: Collection
}

function NftDropPage({collection}:Props) {

	const [claimedSupply, setClaimedSupply] = useState<number>(0);
	const [totalSupply, setTotalSupply] = useState<BigNumber>();
	const [priceInEth, setPriceInEth] = useState<string>();
	const [loading, setLoading] = useState<boolean>(true);
	const nftDrop = useContract(collection.address, "nft-drop").contract;

	//Auth
	const connectWithMetamask = useMetamask();
	const address = useAddress();
	const disconnect = useDisconnect();

	useEffect(() => {
		if(!nftDrop) return 

		const fetchPrice = async () => {
			const claimConditions = await nftDrop.claimConditions.getAll();
			setPriceInEth(claimConditions?.[0]?.currencyMetadata.displayValue);
		}

		fetchPrice();
	}, [nftDrop])

	useEffect(() => {
		if(!nftDrop) return;

		const fetchNFTDropData = async () => {
			setLoading(true);
			const claimedNFTs = await nftDrop.getAllClaimed();
			const total = await nftDrop.totalSupply();
			console.log(claimedNFTs)

			setClaimedSupply(claimedNFTs.length);
			console.log("here"+setClaimedSupply(claimedNFTs.length))
			setTotalSupply(total); 
			setLoading(false);
		}
		fetchNFTDropData()
	},[nftDrop])

	const mintNft = () => {
		if(!nftDrop || !address) return;
		const quantity = 1;
		setLoading(true);
		const notification = toast.loading("Minting NFT...", {
			style:{
				background:"white",
				color:"green",
				fontWeight:"bolder",
				fontSize:"17px",
				padding:"20px"
			}
		})
		nftDrop.claimTo(address, quantity).then(async(tx)=>{
			const receipt = tx[0].receipt;
			const claimedTokenId = tx[0].id
			const claimedNFTs = await tx[0].data

			toast("You have claimed a JIM NFT!", {
				duration: 8000,
				style:{
					background:"green",
					color:"white",
					fontWeight:"bolder",
					fontSize:"17px",
					padding:"20px"	
				}
			})

			console.log(receipt)
			console.log(claimedTokenId)
			console.log(claimedNFTs)
		})
		.catch((err)=>{
			console.log(err)
			toast("Something went wrong", {
				duration: 8000,
				style:{
					background:"red",
					color:"white",
					fontWeight:"bolder",
					fontSize:"17px",
					padding:"20px"
				}
			})
		})
		.finally(()=>{
			setLoading(false)
			toast.dismiss(notification) // regardless of success or failure, dismiss the notification
		})
	}	

	return (
		<div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
			<Toaster position ="bottom-center"/> 
			{/* /{left side} */}
			<div className="lg:col-span-4 bg-gradient-to-br from-pink-300 to-blue-400">
				<div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
					<div className="rounded-xl bg-gradient-to-br from-white to-green-200 p-2">
						<img className="w-44 rounded-xl object-cover lg:h-96 lg:w-72" src={urlFor(collection.previewImage).url()} alt="" />
					</div>
					<div className="space-y-2 p-5 text-center">
						<h1 className="text-4xl font-bold text-white">{collection.nftCollectionName}</h1>
						<h2 className="text-xl text-gray-300">{collection.description }</h2>
					</div>
				</div>
			</div>

			{/* {right side} */}
			<div className="flex flex-1 flex-col p-12 lg:col-span-6">
				{/* {Header} */}
			
				<header className="flex items-center justify-between">
					<Link href={'/'}>
					<h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
							Welcome to <span className="font-extrabold underline decoration-pink-600/50">ANDRE'S</span> NFT Marketplace
						</h1>
					</Link>
					<button onClick={() => (address ? disconnect() : connectWithMetamask())} className="rounded-full bg-blue-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base">
						{address? 'Sign out' : 'Sign in'}
					</button>
				</header>

				<hr className="my-2 border"/>

				{address && (
					<p className="text-center text-sm text-blue-400">You're logged in with your wallet {address.substring(0,5)}...{address.substring(address.length - 5)}</p>
				)}

				{/* {Content} */}
				<div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
					<img className="w-80 object-cover pb-10 lg:h-40" src={urlFor(collection.mainImage).url()} alt=""/>
					<h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">{collection.title}</h1>

					{loading ? (
						<p className="animate-pulse pt-2 text-xl text-green-500">Loading...</p>
					) : (
						<p className="pt-2 text-xl text-green-500">
							Claimed {claimedSupply} of {totalSupply?.toString()} NFTS
						</p>
					)}

					{loading && (
						<img className="h-80 w-80 object-contained" src="http://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"></img>
					)}
				
				</div>

				{/* {Mint Button} */}
				<button onClick={mintNft} disabled={loading || claimedSupply === totalSupply?.toNumber() || !address} className="h-16 w-full rounded-full bg-red-600 text-white font-bold disabled:bg-gray-400">
					{loading ? (
						<>Loading</>
					): claimedSupply === totalSupply?.toNumber() ? (
						<>Sold Out</>
					) : !address ? (
						<>Sign in to mint</>
					) : (
						<span className="font-bold">Mint NFT ({priceInEth}) ETH</span>
					)}
				</button>
			</div>
		</div>
	);
}

export default NftDropPage;

export const getServerSideProps: GetServerSideProps = async ({params}) => {

	const query = `*[_type == "collection" && slug.current == $id][0]{
		_id,
		title,
		address,
		description,
		nftCollectionName,
		mainImage{
		asset
	  },
	  previewImage {
		asset
	  },
	  slug {
		current
	  },
	  creator->{
		_id,
		name,
		address,
		slug {
		current
	  },
	  },
	  }
	  `;

	const collection = await sanityClient.fetch(query, { 
		id: params?.id
	})

	if(!collection) {
		return{
			notFound:true
		}
	}
	return{
		props:{
			collection
		}
	}
}
