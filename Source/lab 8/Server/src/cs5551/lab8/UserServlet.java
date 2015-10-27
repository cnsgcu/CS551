package cs5551.lab8;

import java.io.BufferedReader;
import java.io.IOException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bson.Document;
import org.bson.types.ObjectId;

import com.ibm.json.java.JSON;
import com.ibm.json.java.JSONObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;

@WebServlet("/users/*")
public class UserServlet extends HttpServlet
{
	static private final MongoClientURI uri = new MongoClientURI("mongodb://root:password@ds033734.mongolab.com:33734/mysql");
	
	static private final MongoClient dbCLient = new MongoClient(uri);
	static private final MongoDatabase db = dbCLient.getDatabase(uri.getDatabase());
	static private final MongoCollection<Document> users = db.getCollection("users");
	
	/**
	 * curl test at port 8080: curl -X GET http://localhost:8080/Spider/users/cloud@sky.earth
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		final String email = request.getPathInfo().replace("/", "");

		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Methods", "GET");
		response.addHeader("Access-Control-Allow-Headers", "Content-Type");
		response.addHeader("Access-Control-Max-Age", "86400");
		response.getWriter().append(users.find(new Document("email", email)).first().toJson());			
	}
	
	/**
	 * curl test at port 8080: curl --data '{"name": "Cuong Cu", "email": "cloud@sky.earth"}' http://localhost:8080/Spider/users
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		final StringBuilder builder = new StringBuilder();
		final BufferedReader reader = request.getReader();
		
		String line;
		while ((line = reader.readLine()) != null) {
			builder.append(line);
		}
		
		final JSONObject params = (JSONObject) JSON.parse(builder.toString());
		final Document user = new Document(params);
		
		users.insertOne(user);

		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Methods", "POST");
		response.addHeader("Access-Control-Allow-Headers", "Content-Type");
		response.addHeader("Access-Control-Max-Age", "86400");
		response.getWriter().write(user.toJson());
	}
	
	/**
	 * curl test at port 8080: curl -X PUT -d '{"name": "Cuong"}' http://localhost:8080/Spider/users/562f043de4226304cad21b3e
	 */
	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		final StringBuilder builder = new StringBuilder();
		final BufferedReader reader = request.getReader();
		
		String line;
		while ((line = reader.readLine()) != null) {
			builder.append(line);
		}
		
		final JSONObject params = (JSONObject) JSON.parse(builder.toString());
		final Document user = new Document(params);

		final String oid = request.getPathInfo().replace("/", "");
		
		users.updateOne(
			new Document("_id", new ObjectId(oid)),
	        new Document("$set", user)
        );
		
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Methods", "PUT");
		response.addHeader("Access-Control-Allow-Headers", "Content-Type");
		response.addHeader("Access-Control-Max-Age", "86400");
		response.getWriter().write(user.toJson());
	}
	
	/**
	 * curl test at port 8080: curl -X DELETE http://localhost:8080/Spider/users/56259a83e4b0f82f10b7341d
	 */
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		final String oid = request.getPathInfo().replace("/", "");
		final DeleteResult result = users.deleteOne(new Document("_id", new ObjectId(oid)));
				
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Methods", "DELETE");
		response.addHeader("Access-Control-Allow-Headers", "Content-Type");
		response.addHeader("Access-Control-Max-Age", "86400");
		response.getWriter().write("{\"delete_count\":"+ result.getDeletedCount() + "}");
	}
	
	protected void doOptions(HttpServletRequest request, HttpServletResponse response)
	{
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Methods", "POST, PUT, DELETE, GET");
		response.addHeader("Access-Control-Allow-Headers", "Content-Type");
		response.addHeader("Access-Control-Max-Age", "86400");
	}
}
