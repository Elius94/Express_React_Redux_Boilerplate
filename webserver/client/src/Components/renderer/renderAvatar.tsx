import Avatar from '@mui/material/Avatar';
import { GetUserProfilePic } from '../../BkConnect';
import { orange } from '@mui/material/colors';

interface profilePic {
  fetched: boolean,
  img: string
}

const profilePicsCollection: Array<profilePic> = []

export async function FillProfilePicCollection(_name: any) {
  if (_name) {
    if (!profilePicsCollection[_name]) {
      profilePicsCollection[_name] = {
        fetched: false,
        img: ""
      }
      GetUserProfilePic(_name)
        .then((_profilePic: string) => {
          profilePicsCollection[_name].fetched = true
          profilePicsCollection[_name].img = _profilePic
        })
    }
  }
}

// component react non vuole promise ma jsx
export function RenderStandaloneAvatar(props: any) {
  const { name } = props
  return (
    <Avatar
      style={{ backgroundColor: orange[400] }}
      src={profilePicsCollection[name] && profilePicsCollection[name].fetched ? `data:image/png;base64,${profilePicsCollection[name].img}` : undefined}
    >{profilePicsCollection[name] && profilePicsCollection[name].fetched ? "" : name.toString().substring(0, 1)}</Avatar>
  )
}
