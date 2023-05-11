import { Box } from "@mui/system";
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from "react-router-dom";
import ListGroup from 'react-bootstrap/Listgroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useSelector } from "react-redux";
import { getDatabase, ref, set, update, push, onValue } from "firebase/database";
import { useState, useEffect } from "react";

const CreateGroup = () => {

	const { user, error, sucess } = useSelector(
		(state) => state.user
	)
	const navigate = useNavigate();
	const db = getDatabase();
	const [gname, setGName] = useState('');
	const [desc, setDesc] = useState('');
	const [users, setUsers] = useState([]);
	const [ids, setIds] = useState([]);
	let usersTemp = [];
	let idsTemp = [];

	useEffect(() => {
        onValue(ref(db, 'users/' + user.uid + '/contacts'), (snapshot) => {
           	snapshot.forEach(childSnapshot => {
               let name = childSnapshot.val().name;
               let id = childSnapshot.val().uid;
               usersTemp.push(name);
               idsTemp.push(id);
           	});

           	setUsers(usersTemp);
           	usersTemp = [];
           	setIds(idsTemp);
           	idsTemp = [];
       	});
   });

	function findUid(em) {
        let theirUid;
        onValue(ref(db, 'users/'), (snapshot) => {
            snapshot.forEach(childSnapshot => {
                let email = childSnapshot.child("profile").child("email").val();
                if (em == email) {
                    theirUid = childSnapshot.key;
                }
            });
        });
        return theirUid;
    }

	function reqCheck(uid) {
        let req = true;
        onValue(ref(db, 'users/' + uid + '/notifications'), (snapshot) => {
            snapshot.forEach(childSnapshot => {
                if (childSnapshot.child("type").val() == 'groupinv' && childSnapshot.child("from").val() == user.uid) {
                    req = false;
                }
            });
        });
        return req;
    }

	function setInvite (args) {
		let theirUid = findUid(args);
		if (reqCheck(theirUid) && theirUid != null) {
			push(ref(db, 'users/' + theirUid + '/notifications'), {
				type:'groupinv',
				from:user.uid
				//groupid: groupId
			}); 
		} 
	}

	function handleSubmit(event) {
		console.log(gname);
		event.preventDefault();

		const db = getDatabase();
		push(ref(db, '/groups'), {
			name: gname,
			owner: user.uid,
			admins: [user.uid],
			members: [user.uid],
			desc: desc
		});

		navigate("/Groups");
	};

	return (
		<div class='pageLight2'>
			<Box>
				<br></br>
				<br></br>
				<Typography variant="h1" style={{ color: 'black' }}>
					Create Group
				</Typography>
				<br></br>
			</Box>
			<ListGroup>
				<ListGroup.Item>
					<Form onSubmit={handleSubmit}>
						<Typography variant="h3" style={{
							color: 'black',
							justifyContent: 'left',
							alignItems: 'left'
						}}>
							<Form.Group>
								<Form.Label> Group Name:</Form.Label>
								<Form.Control type="text" placeholder="Enter Name" value={gname} onChange={(event) => setGName(event.target.value)} />
							</Form.Group>
							<Form.Group>
								<Form.Label> Description: </Form.Label>
								<Form.Control type="textarea" placeholder="Enter Description" value={desc} onChange={(event) => setDesc(event.target.value)} style={{ minHeight: '200px' }} />
							</Form.Group>
							{/* <Form.Group>
								<Form.Label> Invite People: </Form.Label>
								<Form.Select onChange={(event) => setInvite(event.target.value)}>}
							        <option>Select People</option>
							            {users.map((users) => {
								            return (
								                <option>{users}</option>
								            )
							            })}
						        </Form.Select>
							</Form.Group> */}
							<Form.Group>
								<Form.Label> Location:</Form.Label>
								<Form.Control type="text" placeholder="Enter Location" />
							</Form.Group>
							<Button type="submit">Create Group</Button>
						</Typography>
					</Form>
				</ListGroup.Item>
				<ListGroup.Item>
					<Link to="/Groups">
						<Button style={{ maxHeight: '50px', }}>
							<Typography variant="h4" style={{ justifyContent: 'right', alignItems: 'right' }}>
								Back
							</Typography>
						</Button>
					</Link>
				</ListGroup.Item>
			</ListGroup>
		</div>
	);
}

export default CreateGroup;