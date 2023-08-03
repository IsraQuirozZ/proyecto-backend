class UserDTO {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.full_name = `${user.first_name} ${user.last_name}`;
    this.email = user.email;
    this.password = user.password;
    this.photo = user.photo;
    this.age = user.age;
    this.role = user.role;
  }
}

export default UserDTO;
