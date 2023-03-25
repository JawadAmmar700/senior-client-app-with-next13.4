const fetcher=async({url,obj}:FetcherProps)=>{
  try{
    const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         ...obj,
          image: `https://source.boringavatars.com/pixel/120/${obj.username}`,
        }),
      });
      if(!res.ok) return Error(res.statusText)
      const data = await res.json();
      return data;
  } catch (error:any) {
    throw new Error(error)
  } 
}

export {fetcher}