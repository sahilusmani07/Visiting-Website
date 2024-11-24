module.exports=(fn)=>{

    return(req,res,next)=>{
        fn(req,res,next).catch(next);

    }

    
}

//--we use this instead of try catch because in try catch is bulky 