let School = require('../models/school');







    let getSchoolNameById = async (schoolId) => {
        const bookmark = await School.findOne({
          _id: schoolId
        });
      
        if (!bookmark) {
            return 'nix';
        } else {
          return bookmark.name;
        }
      };


      let fifi = () => {
    
            return 'nix';
       
      };





 module.exports.getSchoolNameById = getSchoolNameById;
 module.exports.fifi = fifi;


