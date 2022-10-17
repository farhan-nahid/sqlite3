var m=require("sqlite3").verbose(),t=require("express"),c=require("http"),i=t(),d=c.createServer(i),n=new m.Database("./database/image.db");i.use(t.json());n.run("CREATE TABLE IF NOT EXISTS emp(id TEXT, image TEXT)");i.get("/",function(a,e){e.json({name:"Farhan Ahmed Nahid"})});i.post("/image",function(a,e){n.serialize(()=>{n.run("INSERT INTO emp(id,image) VALUES(?,?)",[a.body.id,a.body.image],function(s){if(s)return e.json({message:s.message});e.statusCode=201,e.json({message:"Image successfully added"})})})});i.get("/image",function(a,e){n.serialize(()=>{n.each("SELECT id ID, image IMAGE FROM emp WHERE id =?",["1"],function(s,o){s&&e.json({message:s.message}),o?.ID&&e.json({message:"Success",id:o.ID,image:o.IMAGE}),e.statusCode=400,e.json({message:"Data not found"})})})});i.put("/image/:id",async(a,e)=>{n.serialize(()=>{n.run("UPDATE emp SET image = ? WHERE id = ?",[a.body.image,a.params.id],function(s){s&&e.json({message:s.message}),e.json({message:"Entry updated successfully"})})})});i.delete("/image/:id",function(a,e){n.serialize(()=>{n.run("DELETE FROM emp WHERE id = ?",a.params.id,function(s){s&&e.json({message:s.message}),e.json({message:"Successfully Deleted"})})})});i.get("/close",function(a,e){n.close(s=>{s&&e.send("There is some error in closing the database"),e.json({message:"Database connection successfully closed"})})});d.listen(8080,function(){console.log("Server listening on port: 8080")});
