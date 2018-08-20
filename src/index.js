import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const ListUsers = function(props) {
	return (
		<div>
			<div onClick={props.changeDisplayFunc}> {props.message} </div>

			<div className="container" >
				{props.users.map(user => {
					return (
						<div key={user.id} className="circle">
							<div className ="text">{user.name} </div>
							{user.things.map(thing => {
								return <div className="text" key={thing.id}> {thing.name}</div>;
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};

class Users extends React.Component {
	constructor() {
		super();

		this.state = {
			allUsers: [],
			usersThatHaveThings: [],
			usersToDisplay: [],
			message: 'Click here to only show users with things',
			showUsersWithoutThings: true
		};

		this.changeUsers = this.changeUsers.bind(this);
	}

	async changeUsers() {
		if (this.state.showUsersWithoutThings === true) {
			this.setState({ usersToDisplay: this.state.usersThatHaveThings });
			this.setState({ showUsersWithoutThings: false });
			this.setState({ message: 'Click here to show all users' });
		} else {
			this.setState({ usersToDisplay: this.state.allUsers });
			this.setState({ showUsersWithoutThings: true });
			this.setState({ message: 'Click here to only show users with things' });
		}
	}

	async componentDidMount() {
		const response = await axios.get('https://quiet-waters-66809.herokuapp.com/users');
		this.setState({ allUsers: response.data });
		this.setState({ usersToDisplay: response.data });

		const usersThatHaveThings = response.data.filter(user => {
			return user.things.length > 0;
		});

		this.setState({ usersThatHaveThings: usersThatHaveThings });
	}

	render() {
		return (
			<div>
				<ListUsers
					users={this.state.usersToDisplay}
					changeDisplayFunc={this.changeUsers}
					message={this.state.message}
				/>
			</div>
		);
	}
}

ReactDOM.render(<Users />, document.getElementById('root'));
