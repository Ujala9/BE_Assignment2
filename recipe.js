const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())

const { initializeDatabase } = require("./db/db.connect")

initializeDatabase()

const Recipe = require("./model/recipe.model")

async function CreateRecipe(newRecipe){
    try{
     const recipe = new Recipe(newRecipe)
     const saveRecipe = await recipe.save()
     return saveRecipe
    } catch(error){
        throw error
    }
}

app.post("/recipes", async (req,res) => {
    try{
       const savedRecipe = await CreateRecipe(req.body)
       res.status(201).json({message: "Recipe added successfully", book: savedRecipe})
    }catch(error){
        res.status(500).json({error: "Failed to add recipe"})
    }
})

async function readAllRecipe(){
    try{
     const allRecipe = await Recipe.find()
     return allRecipe
    }catch (error){
       console.log(error) 
    }
}

app.get("/recipes", async (req,res) => {
    try{
     const recipe = await readAllRecipe()
     if(recipe != 0){
        res.json(recipe)
     } else {
        res.status(404).json({error: "Recipe not found"})
     }
    }catch (error){
       res.status(500).json({error: "Failed to fetch Recipe"})
    }
})

async function readRecipeByTitle(recipeTitle){
    try{
     const recipe = await Recipe.findOne({title: recipeTitle})
     return recipe
    }catch(error){
        console.log(error)
    }
}

app.get("/recipes/:titleName", async (req,res) => {
    try{
     const recipe = await readRecipeByTitle(req.params.titleName)
     if(recipe){
        res.json(recipe)
     } else {
        res.status(404).json({error: "Recipe not found"})
     }
    }catch (error){
       res.status(500).json({error: "Failed to fetch Recipe"})
    }
})

async function readRecipeByAuthor(authorName){
    try{
      const recipe = await Recipe.find({author: authorName})
      return recipe
    }catch(error){
        console.log(error)
    }
}

app.get("/recipes/author/:recipeAuthor", async (req,res) => {
    try{
     const recipe = await readRecipeByAuthor(req.params.recipeAuthor)
     if(recipe){
        res.json(recipe)
     } else {
        res.status(404).json({error: "Recipe not found"})
     }
    }catch (error){
       res.status(500).json({error: "Failed to fetch Recipe"})
    }
})

async function readRecipeByDifficultylevel(diffLevel){
    try{
      const recipe = await Recipe.find({difficulty: diffLevel})
      return recipe
    }catch(error){
        console.log(error)
    }
}

app.get("/recipes/difficulty/:diffLevel", async (req,res) => {
    try{
     const recipe = await readRecipeByDifficultylevel(req.params.diffLevel)
     if(recipe){
        res.json(recipe)
     } else {
        res.status(404).json({error: "Recipe not found"})
     }
    }catch (error){
       res.status(500).json({error: "Failed to fetch Recipe"})
    }
})

//Create an API to update a recipe's difficulty level with the help of its id. Update the difficulty of "Spaghetti Carbonara" from "Intermediate" to "Easy". Send an error message "Recipe not found" if the recipe is not found. Make sure to handle errors properly.

async function updateRecipe(recipeId, dataToUpdate){
    try{
     const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId,dataToUpdate, {
        new: true
     })
     return updatedRecipe
    }catch (error){
        throw error
    }
}

app.post("/recipes/:recipeId", async (req,res) =>{
    try{
       const updatedRecipe = await updateRecipe(req.params.recipeId, req.body)
       if(updatedRecipe){
        res.status(200).json({message: "Recipe Updated Successfully",recipe: updatedRecipe})
       }else{
        res.status(404).json({error: "Recipe not found"})
       }
    }catch(error){
        res.status(500).json({error: "Failed to update recipe"})
    }
})

async function updateRecipeByTitle(recipeTitle, dataToUpdate){
    try{
     const updatedRecipe = await Recipe.findOneAndUpdate({title: recipeTitle}, dataToUpdate,{ new: true})
     return updatedRecipe
    }catch (error){
        throw error
    }
}

app.post("/recipe/:recipeTitle", async (req,res) => {
    try{
    const updatedRecipe = await updateRecipeByTitle(req.params.recipeTitle, req.body)
    if(updatedRecipe){
        res.status(200).json({message: "Recipe Updated Successfully",recipe: updatedRecipe})
       }else{
        res.status(404).json({error: "Recipe not found"})
       }
    }catch(error){
        res.status(500).json({error: "Failed to update recipe"})
    }
})

async function deleteRecipeById(recipeId){
 try{
  const deletedRecipe = await Recipe.findByIdAndDelete(recipeId)
  return deletedRecipe
 }catch(error){
    throw error
 }
}

app.delete('/recipe/:recipeId', async(req,res) => {
    try{
        const deletedRecipe = await deleteRecipeById(req.params.recipeId)
        if(deletedRecipe){
        res.status(200).json({message: "Recipe deleted successfully."})
        }
    }catch (error){
        res.status(500).json({error: "Failed to delete recipe"})
    }
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});